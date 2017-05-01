const generateMessage = (owner, text) => {
  return {
    owner,
    text,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage
};
