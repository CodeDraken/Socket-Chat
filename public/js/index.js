var socket = io();

socket.on('connect', function () {
  sendMessage('Bob', 'Hello!');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function ({owner, text, createdAt}) {
  var li = $('<li class="collection-item message"></li>');
  var timestamp = '<span class="secondary-content message-date">' + createdAt + '</span>';
  li.html('<span>' + owner + ': </span>' + '<span>' + text + '</span>' + timestamp);

  $('#messages').append(li);
});

function sendMessage(owner, text) {
  socket.emit('createMessage', {owner, text}, function(msg) {
    console.log('Got it', msg);
  });
}

$('#message-form').on('submit', function (e) {
  e.preventDefault();
  const msgInput = $('[name=message]');

  sendMessage('User', msgInput.val());
  msgInput[0].value = '';
});
