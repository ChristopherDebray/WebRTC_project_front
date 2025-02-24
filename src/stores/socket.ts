import router from '@/router'
import { getAvatarInitials, getAvatarRandomColor } from '@/utils/avatarUtils'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

export interface UserSocket {
  socketId: string
  userName: string
  userColor: string
  userInitials: string
  offer: RTCSessionDescription | null
  answer: RTCSessionDescription | null
  offererIceCandidates: RTCIceCandidate[]
  answererIceCandidates: RTCIceCandidate[]
  isCaller: boolean
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

    isCaller: false as boolean,
    peerConnection: null as null | RTCPeerConnection,
    offererIceCandidates: [] as RTCIceCandidate[],
    answererIceCandidates: [] as RTCIceCandidate[],
    offer: null as null | RTCSessionDescription,
    answer: null as null | RTCSessionDescription,
    localStream: new MediaStream() as MediaStream,
    remoteStream: ref<MediaStream>(new MediaStream()),
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

      'isCaller',
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

        this.createPeerConnection()
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
        this.isCaller = true
        router.push('/call')
      })

      this.socket.on('call:stopped', () => {
        this.outgoingCallUser = null
        router.push('/home')
      })

      this.socket.on('rtc:receive:answer', (answer) => {
        this.peerConnection.setRemoteDescription(answer)
        this.answer = answer
      })

      this.socket.on('rtc:receive:offer', (offer) => {
        console.log('rtc:receive:offer remoteDescription setted')
        this.peerConnection.setRemoteDescription(offer)

        this.offer = offer
        this.createAnswer()
      })

      this.socket.on('rtc:receive:iceCandidate', (candidate: RTCIceCandidate) => {
        if (this.isCaller) {
          this.answererIceCandidates.push(candidate)
        } else {
          this.offererIceCandidates.push(candidate)
        }

        this.peerConnection.addIceCandidate(candidate)
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
      this.isCaller = false

      this.outgoingCallUser = this.incomingUserCall
      this.incomingUserCall = null
      router.push('/call')
    },

    createPeerConnection() {
      const config: RTCConfiguration = {
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      }

      this.peerConnection = new RTCPeerConnection(config)
      this.peerConnection.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
        if (null === e.candidate) {
          return
        }
        // Send the ice candidate to the other user
        if (this.isCaller) {
          this.offererIceCandidates.push(e.candidate)
        } else {
          this.answererIceCandidates.push(e.candidate)
        }

        this.socket.emit('rtc:send:iceCandidate', this.outgoingCallUser, e.candidate)
      })

      this.peerConnection.addEventListener('track', (e) => {
        console.log("addEventListener('track')")

        e.streams[0].getTracks().forEach((track) => {
          console.log('ADD TRACK')

          this.remoteStream.addTrack(track)
        })
      })
    },

    async createOffer() {
      console.log('this.isCaller', this.isCaller)

      if (!this.isCaller) {
        return
      }
      const offer = await this.peerConnection.createOffer()
      this.peerConnection.setLocalDescription(offer)
      this.socket.emit('rtc:send:offer', this.outgoingCallUser, offer)
      console.log('create offer')
    },

    async createAnswer() {
      if (this.isCaller) {
        return
      }
      const answer = await this.peerConnection.createAnswer()
      this.peerConnection.setLocalDescription(answer)
      this.socket.emit('rtc:send:answer', this.outgoingCallUser, answer)
      console.log('create answer')
    },
  },
})
