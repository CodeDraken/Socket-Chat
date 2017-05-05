const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, isNameReserved} = require('./utils/validation');

const srcPath = path.join(__dirname, '../src');
const publicPath = path.join(__dirname, '../public');
const tmpPath = path.join(__dirname, '../.tmp');
const port = process.env.PORT || 3000;

// static file server
app.use(express.static(publicPath)); // minified build
app.use(express.static(tmpPath)); // development
app.use(express.static(srcPath)); // for images during development

io.on('connection', (socket) => {
  //console.log('User connected');

  socket.on('disconnect', () => {
    //console.log('User disconnected');
  });

  socket.on('createMessage', ({owner, text}, callback) => {
    io.emit('newMessage', generateMessage(owner, text));
    callback();
  });

  // socket.on('createGlobalMessage', ({owner, text}, callback) => {
  //   io.emit('newGlobalMessage', generateMessage(owner, text));
  //   callback();
  // });

  socket.on('createLocationMessage', ({latitude, longitude}) => {
    io.emit('newLocationMessage', generateLocationMessage('SocketBot', latitude, longitude));
  });

  socket.on('join', ({name, room}, callback) => {
    if (!isRealString(name) || !isRealString(room))
      return callback('Name and room name are required!');
    
    if (isNameReserved(name))
      return callback('Name is in use!');

    socket.join(room);

    socket.emit('newMessage', generateMessage('SocketBot', `<em>Welcome to the chat ${name}! You're currently in: ${room}</em>`));
    socket.broadcast.to(room).emit('newMessage', generateMessage('SocketBot', `<em>${name} has joined the chatroom</em>`));
    callback();
  });

});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
