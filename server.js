const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle setting username
  socket.on('setUsername', (username) => {
    // Store the username in the socket object
    socket.username = username;
    console.log(`User ${username} connected`);

    // Notify other clients that a new user has joined
    socket.broadcast.emit('userJoined', username);
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    // Broadcast the message to everyone
    io.emit('message', { username: socket.username, message: data });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
    // Notify other clients that a user has left
    socket.broadcast.emit('userLeft', socket.username);
  });
});


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
