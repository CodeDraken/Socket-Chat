const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

// static file server
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.emit('newMessage', {
    owner: 'SocketBot',
    text: `Welcome to the chatroom!`,
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    owner: 'SocketBot',
    text: `User has joined the chatroom`,
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', ({owner, text}) => {
    io.emit('newMessage', {
      owner,
      text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //   from,
    //   text,
    //   createdAt: new Date().toTimeString()
    // });
  });

});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
