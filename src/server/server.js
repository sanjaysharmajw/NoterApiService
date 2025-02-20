const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust for production)
    methods: ['GET', 'POST'],
  },
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register user with their socket ID
  socket.on('register', (userId) => {
    users[userId] = socket.id;
    io.emit('userList', Object.keys(users)); // Broadcast updated user list
  });

  // Handle call initiation
  socket.on('callUser', ({ from, to, offer }) => {
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('incomingCall', { from, offer });
    }
  });

  // Handle call answer
  socket.on('answerCall', ({ to, answer }) => {
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('callAnswered', { answer });
    }
  });

  // Handle ICE candidate exchange
  socket.on('iceCandidate', ({ to, candidate }) => {
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('iceCandidate', { candidate });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      io.emit('userList', Object.keys(users)); // Update user list
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});