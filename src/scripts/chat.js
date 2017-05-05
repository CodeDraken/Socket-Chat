const socket = io();

const scrollToBottom = () => {
  // Selectors
  const messages = $('#messages'),
        newMessage = messages.children('li:last-child');
  // Heights
  const clientHeight = messages.prop('clientHeight'),
        newMessageHeight = newMessage.innerHeight(),
        lastMessageHeight = newMessage.prev().innerHeight(),
        scrollTop = messages.prop('scrollTop'),
        scrollHeight = messages.prop('scrollHeight');

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  // {name, room}
  const params = $.deparam(window.location.search);
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {

    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
  const usersList = $('<div class="collection"></div>');
  console.log('updating users', users)
  users.forEach(user => {
    usersList.append(`<a href="#" class="collection-item">${user}</a>`);
  });
  $('#users').html(usersList);
});

socket.on('newMessage', function ({owner, text, createdAt}) {
  const specialColor = owner === 'SocketBot' ? 'blue-text text-darken-1' : '';
  const date = (new Date(createdAt)).toLocaleTimeString();
  const li = $('<li class="collection-item chat__message"></li>');
  const timestamp = `<span class="secondary-content message__date">${date}</span>`;
  const ownerAndStamp = `<p><strong class="${specialColor}">${owner} : </strong>${timestamp}</p>`;
  const message = `<p>${text}</p>`;
  
  li.append(ownerAndStamp).append(message);
  $('#messages').append(li);
  scrollToBottom();
});

// TODO merge newLocationMessage & newMessage into one function

socket.on('newLocationMessage', function ({owner, url, createdAt}) {
  const specialColor = owner === 'SocketBot' ? 'blue-text text-darken-1' : '';
  // timestamp formatted as: hh:mm:ss AM/PM
  const date = (new Date(createdAt)).toLocaleTimeString();
  const li = $('<li class="collection-item chat__message"></li>');
  const timestamp = `<span class="secondary-content message__date">${date}</span>`;
  const ownerAndStamp = `<p><strong class="${specialColor}">${owner} : </strong>${timestamp}</p>`;
  const a = $('<a target="_blank">My current location</a>');

  a.attr('href', url);
  li.append(ownerAndStamp).append(a);
  $('#messages').append(li);
  scrollToBottom();
});

function sendMessage(owner, text) {
  socket.emit('createMessage', {owner, text}, function() {
  });
}

// jQuery things
$(document).ready(function() {
  const startSendMessage = function (e) {
    e.preventDefault();
    const msgInput = $('[name=message]');

    sendMessage('User', msgInput.val());
    msgInput[0].value = '';
  };

  $('#message-form').on('submit', startSendMessage);

  const locationButton = $('#send-location');
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
