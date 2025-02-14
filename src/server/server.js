const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("create_room", (roomId) => {
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    socket.to(roomId).emit("user-joined", { socketId: socket.id });
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice_candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Example HTTP endpoint to create room via POST request
app.post("/create-room", (req, res) => {
  const { roomId } = req.body;
  // Trigger WebSocket event for room creation
  io.emit("create_room", roomId);
  res.status(200).send({ message: `Room ${roomId} created` });
});

// Example HTTP endpoint to join room via POST request
app.post("/join-room", (req, res) => {
  const { roomId } = req.body;
  io.emit("join_room", roomId);
  res.status(200).send({ message: `Joined room ${roomId}` });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
