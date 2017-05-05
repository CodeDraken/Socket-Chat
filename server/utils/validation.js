const isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const isNameReserved = (name) => {
  const reserved = ['socketbot', 'admin', 'bot', 'moderator'];
  return reserved.indexOf(name.toLowerCase()) !== -1;
};

module.exports = {isRealString, isNameReserved};
