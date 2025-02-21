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

      this.socket.on('disconnect', () => {
        this.isConnected = false
        this.userName = null
      })

      this.socket.on('user:new', (newConnectedUser: UserSocket) => {
        if (!this.socket) {
          return
        }

        this.connectedUsers.push(newConnectedUser)
      })

      this.socket.on('user:list', (connectedUsers: UserSocket[]) => {
        this.connectedUsers = connectedUsers
      })

      this.socket.on('call:receive', (callingUser) => {
        this.incomingUserCall = callingUser
      })

      this.socket.on('call:rejected', () => {
        this.calledUser = null
      })

      this.socket.on('call:cancelled', () => {
        this.incomingUserCall = null
      })

      this.socket.on('call:accepted', () => {
        this.outgoingCallUser = this.calledUser
        this.calledUser = null
        router.push('/call')
      })

      this.socket.on('call:stopped', () => {
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
      this.socket.emit('call:new', calledUser, this.user)
    },

    cancelCall(calledUser: UserSocket) {
      if (!this.socket) return
      this.calledUser = null
      this.socket.emit('call:cancel', calledUser)
    },

    hangUp() {
      if (!this.socket) return
      this.socket.emit('call:stop', this.outgoingCallUser)
      this.outgoingCallUser = null
      router.push('/home')
    },

    rejectCall() {
      if (!this.socket) return
      this.socket.emit('call:reject', this.incomingUserCall)
      this.incomingUserCall = null
    },

    acceptCall() {
      if (!this.socket) return
      this.socket.emit('call:accept', this.incomingUserCall)
      console.log(this.incomingUserCall)

      this.outgoingCallUser = this.incomingUserCall
      this.incomingUserCall = null
      router.push('/call')
    },
  },
})
