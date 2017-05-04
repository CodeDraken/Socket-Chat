const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message');

const srcPath = path.join(__dirname, '../src');
const publicPath = path.join(__dirname, '../public');
const tmpPath = path.join(__dirname, '../.tmp');
const port = process.env.PORT || 3000;

// static file server
app.use(express.static(publicPath)); // minified build
app.use(express.static(tmpPath)); // development
app.use(express.static(srcPath)); // for images during development

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.emit('newMessage', generateMessage('SocketBot', `Welcome to the chat app user`));

  socket.broadcast.emit('newMessage', generateMessage('SocketBot', `User has joined the chatroom`));

  socket.on('createMessage', ({owner, text}, callback) => {
    io.emit('newMessage', generateMessage(owner, text));
    callback('This is from server');
  });

  socket.on('createLocationMessage', ({latitude, longitude}) => {
    io.emit('newLocationMessage', generateLocationMessage('SocketBot', latitude, longitude));
  });

});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
