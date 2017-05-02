var socket = io();

socket.on('connect', function () {
  
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

socket.on('newLocationMessage', function ({owner, url, createdAt}) {
  var li = $('<li class="collection-item message"></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${owner}: `);
  a.attr('href', url);
  li.append(a);
  $('#messages').append(li);
});

function sendMessage(owner, text) {
  socket.emit('createMessage', {owner, text}, function(msg) {
    console.log('Got it', msg);
  });
}

// jQuery things
$(document).ready(function() {

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    const msgInput = $('[name=message]');

    sendMessage('User', msgInput.val());
    msgInput[0].value = '';
  });

  var locationButton = $('#send-location');
  locationButton.on('click', function(e) {
    e.preventDefault();
    if (!navigator.geolocation) return (
      Materialize.toast('Geolocation not supported by your browser', 3000, 'orange')
    );
    
    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function () {
      Materialize.toast('Unable to fetch location', 3000, 'yellow darken-3')
    });
  });
});
