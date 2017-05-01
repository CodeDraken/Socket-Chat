var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function ({owner, text, createdAt}) {
  console.log(`${createdAt} ${owner}: ${text}`);
});

function send(owner, text) {
  socket.emit('createMessage', {
    owner,
    text
  });
}
