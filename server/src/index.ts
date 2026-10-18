import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import routes from './routes/api.js';
import { initSocket } from './socket/queueSocket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Setup Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});
initSocket(io);

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CareFlow Enterprise Healthcare API',
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🩺 CareFlow Healthcare API & Real-time Server Running`);
  console.log(`📍 HTTP API: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket Server: ws://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
