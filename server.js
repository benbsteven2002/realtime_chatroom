const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const apiKey = require('./config.js')



const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const upload = multer({ dest: 'uploads/' });

const users = new Set();
const files = new Set();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '/uploads/', filename);

  // Send the file as the response
  res.download(filePath, (err) => {
    if (err) {
      // Handle file download error
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log('File uploaded:', req.file);

    // Get the original filename
    const originalFilename = req.file.originalname;

    // Build the destination path with the original filename
    const destinationPath = 'uploads/' + originalFilename;

    // Rename the uploaded file to the original filename
    fs.renameSync(req.file.path, destinationPath);

    res.json({ message: 'File uploaded successfully' });
    files.add(originalFilename)
    io.emit('fileUploaded', Array.from(files));
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

io.on('connection', (socket) => {
  console.log('A user session started:');

  // Handle login
  socket.on('login', (username) => {
    console.log(`We have a login request ${username}`);

    if (users.has(username)) {
      socket.emit('badLogin');
    } else {
      socket.emit('loginSuccess');
      socket.username = username;
      users.add(username);
      const connectMessage = `User "${username}" connected`;
      console.log(connectMessage);
      io.emit('message', {username: "Server", message: connectMessage})
      // Send the updated list of online users to client
      io.emit('onlineUsers', Array.from(users));
      io.emit('fileUploaded', Array.from(files));
    }
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    
    // Weather request
    if (message.startsWith("weather")) {
      const city = message.substring(8);
      
      weatherRequest(city, socket);
    } else {
      // Else broadcast a message to everyone
      io.emit('message', { username: socket.username, message: message });
    }
    

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

  // Handle voice note
  socket.on('audio', data => {
    io.emit('audio', data);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`User ${socket.username} disconnected`);
      users.delete(socket.username);
      // Notify other clients that a user has left
      const connectMessage = `User "${socket.username}" disconnected`;
      console.log(connectMessage);
      io.emit('message', {username: "Server", message: connectMessage})
      io.emit('onlineUsers', Array.from(users));
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function weatherRequest(city, socket) {
  getWeather(city)
    .then(weatherData => {
      console.log('Temperature:', weatherData.temperature);
      console.log('Wind Speed:', weatherData.windSpeed);

      // Emit the weather information to the requesting socket
      socket.emit('message', {
        username: 'Weather Bot',
        message: `In ${city}, the temperature is ${weatherData.temperature}°C and the wind speed is ${weatherData.windSpeed} m/s.`
      });
    })
    .catch(error => {
      console.error('Error:', error);

      // Emit an error message to the requesting socket
      socket.emit('message', {
        username: 'Weather Bot',
        message: `Sorry, an error occurred while retrieving the weather for ${city}. Please try again later.`
      });
    });
}

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract the relevant weather information from the API response
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;

    // Return the weather information
    return { temperature, windSpeed };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}
