import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://widely-flavor-flights-reflects.trycloudflare.com';
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};
