import { getAvatarInitials, getAvatarRandomColor } from '@/utils/avatarUtils';
import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
export interface UserSocket {
    socketId: string;
    userName: string;
    userColor: string;
    userInitials: string;
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

  actions: {
    connect(userName: string, password: string) {
      if (this.socket) {
        console.log('Already connected');
        return;
      }
      
      const userColor = getAvatarRandomColor();
      const userInitials = getAvatarInitials(userName);
      this.socket = io(import.meta.env.VITE_WEBSOCKET_SERVER, {
        auth: {
          userName,
          password,
          userColor,
          userInitials
        },
      });

      this.userName = userName;
      this.userColor = userColor;
      this.userInitials = userInitials;

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.isConnected = true;
        this.user = {
          socketId: this.socket.id,
          userName,
          userColor,
          userInitials,
        }

        console.log(this.user);
      });

      this.socket.on('newConnectedUser', (newConnectedUser: UserSocket) => {
        if (!this.socket) {
            return
        }

        this.connectedUsers.push(newConnectedUser);
      });

      this.socket.on('connectedUsersList', (connectedUsers: UserSocket[]) => {
        this.connectedUsers = connectedUsers;
      });

      this.socket.on('callingUser', (callingUser) => {
        this.incomingUserCall = callingUser;
      })

      this.socket.on('disconnect', () => {
        console.error('Disconnected from WebSocket server');
        this.isConnected = false;
        this.userName = null;
      });

      this.socket.on('callRejected', () => {
        console.log('callRejected');
        
        this.calledUser = null;
      })
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },

    call(calledUser: UserSocket) {
      if (!this.socket) return
      this.calledUser = calledUser;
      console.log(this.user);
      
      this.socket.emit('callUser', calledUser, this.user)
    },

    hangUp() {

    },

    rejectCall() {
      if (!this.socket) return
      this.socket.emit('rejectCall', this.incomingUserCall)
      this.incomingUserCall = null;
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
      this.socket.emit('acceptCall', this.incomingUserCall)
    }
  },
});
