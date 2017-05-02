const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./../utils/message');

describe('generateMessage', () => {

  it('should generate correct message object', () => {
    const message = {owner: 'Bob', text: 'Hello'};
    const {owner, text, createdAt} = generateMessage(message.owner, message.text);

    expect(owner).toBe(message.owner);
    expect(text).toBe(message.text);
    expect(createdAt).toBeA('number');
  });

});

describe('generateLocationMessage', () => {

  it('should generate correct location object', () => {
    const message = {owner: 'Bob', latitude: 123, longitude: 456};
    const {owner, url, createdAt} = generateLocationMessage(message.owner, message.latitude, message.longitude);

    expect(owner).toBe(message.owner);
    expect(url).toBe(`https://www.google.com/maps?q=${message.latitude},${message.longitude}`);
    expect(createdAt).toBeA('number');
  });

});
