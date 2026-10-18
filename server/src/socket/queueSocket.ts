import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (serverIo: SocketIOServer) => {
  io = serverIo;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join doctor OPD room
    socket.on('join_doctor_queue', (doctorId: string) => {
      const room = `doctor_${doctorId}`;
      socket.join(room);
      console.log(`[Socket.io] Socket ${socket.id} joined ${room}`);
    });

    // Join patient personal appointment/token room
    socket.on('join_patient_token', (tokenNumber: string) => {
      const room = `token_${tokenNumber}`;
      socket.join(room);
      console.log(`[Socket.io] Socket ${socket.id} joined personal token room ${room}`);
    });

    // Leave rooms
    socket.on('leave_doctor_queue', (doctorId: string) => {
      socket.leave(`doctor_${doctorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
};

// Dispatch helper for real-time queue notifications
export const emitQueueUpdate = (doctorId: string, queueData: any) => {
  if (io) {
    io.to(`doctor_${doctorId}`).emit('queue_updated', queueData);
    io.emit('global_queue_updated', queueData); // For public clinic boards
  }
};

export const emitTokenStatusChange = (tokenNumber: string, statusData: any) => {
  if (io) {
    io.to(`token_${tokenNumber}`).emit('token_status_changed', statusData);
  }
};
