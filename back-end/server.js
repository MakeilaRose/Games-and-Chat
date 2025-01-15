const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // CORS middleware
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);

// CORS configuration for both HTTP and WebSocket
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Use env variable for frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    transports: ['polling', 'websocket'], // Allow both transports
  }
});

// Use the CORS middleware for regular HTTP requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Use env variable for frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Route to check server status
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Handling Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);  // Broadcast message to all connected clients
  });
});

// Set the server to listen on the port provided by Render (or fallback to 4000)
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
