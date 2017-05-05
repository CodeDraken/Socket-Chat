const isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const isNameReserved = (name) => {
  const reserved = ['socketbot', 'admin', 'bot', 'moderator'];
  return reserved.indexOf(name.toLowerCase()) !== -1;
};

const isNameTooLong = (name) => {
  return name.length > 12;
};

module.exports = {isRealString, isNameReserved, isNameTooLong};
