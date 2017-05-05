const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, isNameReserved, isNameTooLong} = require('./utils/validation');
const {Users} = require('./utils/users');

const srcPath = path.join(__dirname, '../src');
const publicPath = path.join(__dirname, '../public');
const tmpPath = path.join(__dirname, '../.tmp');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
const users = new Users();


// static file server
app.use(express.static(publicPath)); // minified build
app.use(express.static(tmpPath)); // development
app.use(express.static(srcPath)); // for images during development

io.on('connection', (socket) => {
  //console.log('User connected');

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('SocketBot', `<em>${user.name} has left the room</em>`));
    }
  });

  socket.on('createMessage', ({text}, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text));
    }
    
    callback();
  });

  socket.on('createGlobalMessage', ({text}, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.emit('newMessage', generateMessage(user.name, text));
    }
    
    callback();
  });

  socket.on('createLocationMessage', ({latitude, longitude}) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, latitude, longitude));
    }
    
  });

  socket.on('join', ({name, room}, callback) => {
    if (!isRealString(name) || !isRealString(room))
      return callback('Name and room name are required!');
    
    if (isNameReserved(name))
      return callback('Name is in use!');
    
    if (isNameTooLong(name))
      return callback('Name is too long!');

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);

    io.to(room).emit('updateUserList', users.getUserList(room));

    socket.emit('newMessage', generateMessage('SocketBot', `<em>Welcome to the chat ${name}! You're currently in: <strong>${room}</strong></em>`));

    socket.broadcast.to(room).emit('newMessage', generateMessage('SocketBot', `<em>${name} has joined the chatroom</em>`));

    callback();
  });

});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
