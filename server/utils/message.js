const generateMessage = (owner, text) => {
  return {
    owner,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (owner, latitude, longitude) => {
  return {
    owner,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};


module.exports = {
  generateMessage,
  generateLocationMessage
};
