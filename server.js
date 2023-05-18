const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
