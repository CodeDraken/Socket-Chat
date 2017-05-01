const expect = require('expect');

const {generateMessage} = require('./../utils/message');

describe('generateMessage', () => {

  it('should generate correct message object', () => {
    const message = {owner: 'Bob', text: 'Hello'};
    const {owner, text, createdAt} = generateMessage('Bob', 'Hello');

    expect(owner).toBe(message.owner);
    expect(text).toBe(message.text);
    expect(createdAt).toBeA('number');
  });

});
