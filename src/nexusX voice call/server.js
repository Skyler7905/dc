const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

let rooms = {}; // Stores rooms and their participants

app.use(express.static("public")); // Serve static files from the "public" folder

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("create", (callback) => {
    const room = generateRoomCode();
    rooms[room] = [socket.id];
    socket.join(room);
    console.log(`Room ${room} created by ${socket.id}`);
    callback(room); // Send room code back to the client
  });

  socket.on("join", (room) => {
    if (rooms[room]) {
      rooms[room].push(socket.id);
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
      io.to(room).emit("ready", room); // Notify participants that a peer is ready
    } else {
      console.log(`Room ${room} does not exist.`);
      socket.emit("error", "Room does not exist.");
    }
  });

  socket.on("candidate", (data) => {
    const targetSocket = data.sendTo;
    console.log(`Sending ICE candidate from ${socket.id} to ${targetSocket}`);
    io.to(targetSocket).emit("candidate", data);
  });

  socket.on("offer", (data) => {
    console.log(`Sending offer from ${socket.id} to ${data.receiver}`);
    io.to(data.receiver).emit("offer", { caller: socket.id, event: data.sdp });
  });

  socket.on("answer", (data) => {
    console.log(`Sending answer from ${socket.id} to ${data.caller}`);
    io.to(data.caller).emit("answer", data.sdp);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });
});

// Helper Function: Generate a unique room code
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
