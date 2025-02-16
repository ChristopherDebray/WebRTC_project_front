import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

interface UserSocket {
    socketId: string;
    userName: string;
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as Socket | null,
    userName: null as string | null,
    isConnected: false,
    connectedUsers: [] as UserSocket[],
  }),

  actions: {
    connect(userName: string, password: string) {
      if (this.socket) {
        console.log('Already connected');
        return;
      }

      this.socket = io(import.meta.env.VITE_WEBSOCKET_SERVER, {
        auth: {
          userName,
          password,
        },
      });

      this.userName = userName;

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.isConnected = true;
      });

      this.socket.on('newConnectedUsers', (newConnectedUsers: UserSocket[]) => {
        console.log('Received new connected users:', newConnectedUsers);
        this.connectedUsers = newConnectedUsers;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        this.isConnected = false;
        this.userName = null;
      });
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },
  },
});
