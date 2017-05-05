$(document).ready(function() {

  const login = JSON.parse(localStorage.getItem('login')) || undefined;

  if (login) {
    const name = $('#join [name=name]')[0];
    const room = $('#join [name=room]')[0];

    name.value = login.name;
    room.value = login.room;
  }

  const isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };

  const isNameReserved = (name) => {
    const reserved = ['socketbot', 'admin', 'bot', 'moderator'];
    return reserved.indexOf(name.toLowerCase()) !== -1;
  };

  $('#join').submit((evt) => {
    const name = $('#join [name=name]').val();
    const room = $('#join [name=room]').val();

    if (!isRealString(name) || !isRealString(room)) {
      Materialize.toast('A name and room is required!', 3000, 'orange darken-2')
      return evt.preventDefault();
    }

    if (isNameReserved(name)) {
      Materialize.toast('That name is in use!', 3000, 'yellow darken-3');
      return evt.preventDefault();
    }

    localStorage.setItem('login', JSON.stringify({name, room}));
  });


});
