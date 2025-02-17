const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:your_port",
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

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
