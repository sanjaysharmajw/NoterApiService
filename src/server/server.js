const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Use process.env.PORT for Heroku deployment, fallback to 3000 for local
const PORT = process.env.PORT || 3000;

// Adjust CORS settings for production and development environments
const allowedOrigin = process.env.NODE_ENV === 'production' 
  ? 'https://note-socket-4cbc5fb9e19e.herokuapp.com/' 
  : 'http://localhost:your_port';

const io = socketIo(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  }
});

// Store rooms and their participants
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create_room', (roomId) => {
    console.log(`Room created: ${roomId}`);
    socket.join(roomId);
    rooms.set(roomId, new Set([socket.id]));
  });

  // Join an existing room
  socket.on('join_room', (roomId) => {
    if (rooms.has(roomId)) {
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId);
      rooms.get(roomId).add(socket.id);
      socket.to(roomId).emit('user-joined', { socketId: socket.id });
    } else {
      console.log(`Room ${roomId} does not exist`);
      socket.emit('room_error', { message: 'Room does not exist' });
    }
  });

  // Handle WebRTC Offer
  socket.on('offer', (data) => {
    console.log(`Offer received from ${socket.id} for room: ${data.roomId}`);
    socket.to(data.roomId).emit('offer', { 
      sdp: data.offer.sdp, 
      type: data.offer.type, 
      senderId: socket.id 
    });
  });

  // Handle WebRTC Answer
  socket.on('answer', (data) => {
    console.log(`Answer received from ${socket.id} for room: ${data.roomId}`);
    socket.to(data.roomId).emit('answer', { 
      sdp: data.answer.sdp, 
      type: data.answer.type, 
      senderId: socket.id 
    });
  });

  // Handle ICE Candidate Exchange
  socket.on('ice-candidate', (data) => {
    console.log(`ICE Candidate from ${socket.id} for room: ${data.roomId}`);
    socket.to(data.roomId).emit('ice-candidate', { 
      candidate: data.candidate, 
      sdpMid: data.sdpMid, 
      sdpMLineIndex: data.sdpMLineIndex, 
      senderId: socket.id 
    });
  });

  // Handle User Disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);

    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(roomId).emit('user-left', { socketId: socket.id });

        // Delete empty rooms
        if (participants.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted`);
        }
      }
    });
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
