var socket = io();

socket.on('connect', function () {
  
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function ({owner, text, createdAt}) {
  var date = (new Date(createdAt)).toLocaleTimeString();
  var li = $('<li class="collection-item chat__message"></li>');
  var timestamp = '<span class="secondary-content message__date">' + date + '</span>';
  var ownerAndStamp = '<p><strong>' + owner + ': </strong>' + timestamp + '</p>';
  var message = '<p>' + text + '</p>';
  
  li.append(ownerAndStamp).append(message);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function ({owner, url, createdAt}) {
  // timestamp formatted as: hh:mm:ss AM/PM
  var date = (new Date(createdAt)).toLocaleTimeString();
  var li = $('<li class="collection-item chat__message"></li>');
  var timestamp = '<span class="secondary-content message__date">' + date + '</span>';
  var ownerAndStamp = '<p><strong>' + owner + ': </strong>' + timestamp + '</p>';
  var a = $('<a target="_blank">My current location</a>');

  a.attr('href', url);
  li.append(ownerAndStamp).append(a);
  $('#messages').append(li);
});

function sendMessage(owner, text) {
  socket.emit('createMessage', {owner, text}, function() {
  });
}

// jQuery things
$(document).ready(function() {
  var startSendMessage = function (e) {
    e.preventDefault();
    const msgInput = $('[name=message]');

    sendMessage('User', msgInput.val());
    msgInput[0].value = '';
  };

  $('#message-form').on('submit', startSendMessage);

  var locationButton = $('#send-location');
  locationButton.on('click', function(e) {
    e.preventDefault();
    if (!navigator.geolocation) return (
      Materialize.toast('Geolocation not supported by your browser', 3000, 'orange')
    );

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    
    navigator.geolocation.getCurrentPosition(function (position) {
      locationButton.removeAttr('disabled').text('Send my location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function () {
      locationButton.removeAttr('disabled').text('Send my location');
      Materialize.toast('Unable to fetch location', 3000, 'yellow darken-3');
    });
  });

  $('#messageArea').on('keypress', function(e) {
    if (e.which === 13) startSendMessage(e);
  });

});
