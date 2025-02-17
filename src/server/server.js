const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Use process.env.PORT for Heroku's dynamic port or fallback to 3000 for local development
const PORT = process.env.PORT || 3000;

// Modify CORS to handle dynamic environments
const allowedOrigin = process.env.NODE_ENV === 'production' ? 'https://your-heroku-app-name.herokuapp.com' : 'http://localhost:3000';

const io = socketIo(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('create_room', (roomId) => {
    console.log('Create room:', roomId);
    socket.join(roomId);
  });

  socket.on('join_room', (roomId) => {
    console.log('User joined room:', roomId);
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { socketId: socket.id });
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data.offer);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data.answer);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
