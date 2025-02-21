import router from '@/router'
import { getAvatarInitials, getAvatarRandomColor } from '@/utils/avatarUtils'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
export interface UserSocket {
  socketId: string
  userName: string
  userColor: string
  userInitials: string
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as Socket | null,
    userName: null as string | null,
    userColor: undefined as string | undefined,
    userInitials: null as string | null,
    user: null as null | UserSocket,
    isConnected: false,
    connectedUsers: [] as UserSocket[],
    outgoingCallUser: null as null | UserSocket,
    incomingUserCall: null as null | UserSocket,
    calledUser: null as null | UserSocket,
  }),
  persist: {
    pick: [
      'userName',
      'userColor',
      'userInitials',
      'user',
      'isConnected',
      'connectedUsers',
      'outgoingCallUser',
      'incomingUserCall',
      'calledUser',
    ],
  },

  actions: {
    connect(userName: string) {
      if (this.socket) {
        return
      }

      const userColor = this.userColor ?? getAvatarRandomColor()
      const userInitials = this.userInitials ?? getAvatarInitials(userName)
      this.socket = io(import.meta.env.VITE_WEBSOCKET_SERVER, {
        auth: {
          userName,
          userColor,
          userInitials,
        },
      })

      this.userName = userName
      this.userColor = userColor
      this.userInitials = userInitials

      this.socket.on('connect', () => {
        if (!this.socket) {
          return
        }
        this.isConnected = true

        this.user = {
          socketId: this.socket.id,
          userName: this.userName,
          userColor: this.userColor,
          userInitials: this.userInitials,
        }
      })

      this.socket.on('newConnectedUser', (newConnectedUser: UserSocket) => {
        if (!this.socket) {
          return
        }

        this.connectedUsers.push(newConnectedUser)
      })

      this.socket.on('connectedUsersList', (connectedUsers: UserSocket[]) => {
        this.connectedUsers = connectedUsers
      })

      this.socket.on('callingUser', (callingUser) => {
        this.incomingUserCall = callingUser
      })

      this.socket.on('disconnect', () => {
        this.isConnected = false
        this.userName = null
      })

      this.socket.on('callRejected', () => {
        this.calledUser = null
      })

      this.socket.on('canceledCall', () => {
        this.incomingUserCall = null
      })

      this.socket.on('acceptedCall', () => {
        this.outgoingCallUser = this.calledUser
        this.calledUser = null
        router.push('/call')
      })

      this.socket.on('callStopped', () => {
        this.outgoingCallUser = null
        router.push('/home')
      })
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        this.userName = null
        this.userColor = undefined
        this.userInitials = null
        this.user = null
        this.isConnected = false
        this.connectedUsers = []
        this.outgoingCallUser = null
        this.incomingUserCall = null
        this.calledUser = null

        router.replace('/')
      }
    },

    call(calledUser: UserSocket) {
      if (!this.socket) return
      this.calledUser = calledUser
      this.socket.emit('callUser', calledUser, this.user)
    },

    cancelCall(calledUser: UserSocket) {
      if (!this.socket) return
      this.calledUser = null
      this.socket.emit('cancelCall', calledUser)
    },

    hangUp() {
      if (!this.socket) return
      this.socket.emit('stopCall', this.outgoingCallUser)
      this.outgoingCallUser = null
      router.push('/home')
    },

    rejectCall() {
      if (!this.socket) return
      this.socket.emit('rejectCall', this.incomingUserCall)
      this.incomingUserCall = null
      /**
       * @todo
       *    Change var names, one for currentCallUser that is the one you are in call with
       *    One for the incomming call
       *    One for the outputed call (user you are trying to reach)
       */
    },

    acceptCall() {
      /**
       * @todo
       *  put the user video room
       *    Once the other user is in
       *      Make webRTC connection
       */
      if (!this.socket) return
      this.socket.emit('acceptCall', this.incomingUserCall)
      console.log(this.incomingUserCall)

      this.outgoingCallUser = this.incomingUserCall
      this.incomingUserCall = null
      router.push('/call')
    },
  },
})
