const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Set();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user session started:');

  socket.on('login', (username) => {
    console.log(`We have a login request ${username}`);

    if (users.has(username)) {
      socket.emit('badLogin');
    } else {
      socket.emit('loginSuccess');
      socket.username = username;
      users.add(username);
      console.log(`User ${username} connected`);
      // Send the updated list of online users to client
      io.emit('onlineUsers', Array.from(users))
    }
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    // Broadcast the message to everyone
    io.emit('message', { username: socket.username, message: data });
  });

  // Handle incoming whisper
  socket.on('whisper', (data) => {
    const { username, messageContent } = data;
    const whisperMessage = "/w " + messageContent;

    // Send the message to the specific user 
    const targetSocket = Array.from(io.sockets.sockets.values()).find(
      (socket) => socket.username === username
    );

    // Emit the whisper message to the sender
    socket.emit('whisper', { username: socket.username, message: whisperMessage });


    if (targetSocket) {
      targetSocket.emit('whisper', { username: socket.username, message: whisperMessage });
    }
  });


  // Handle user disconnection
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`User ${socket.username} disconnected`);
      users.delete(socket.username);
      // Notify other clients that a user has left
      io.emit('onlineUsers', Array.from(users))
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
