const expect = require('expect');

const {Users} = require('../utils/users');

describe('Users class', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 123,
      name: 'Bob',
      room: 'Node'
    }, {
      id: 321,
      name: 'John',
      room: 'React'
    }, {
      id: 456,
      name: 'Jen',
      room: 'Node'
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const {id, name, room} = {
      id: 123,
      name: 'Bob',
      room: 'Test_Room'
    };
    const resUser = users.addUser(id, name, room);

    expect(users.users).toEqual([{id, name, room}]);
  });

  it('should return names for Node room', () => {
    const userList = users.getUserList('Node');

    expect(userList).toEqual(['Bob', 'Jen']);
  });

  it('should return names for React room', () => {
    const userList = users.getUserList('React');

    expect(userList).toEqual(['John']);
  });

  it('should remove a user', () => {
    const removedUser = users.removeUser(123);

    expect(removedUser).toEqual({
      id: 123,
      name: 'Bob',
      room: 'Node'
    });
    expect(users.users).toEqual([{
      id: 321,
      name: 'John',
      room: 'React'
    }, {
      id: 456,
      name: 'Jen',
      room: 'Node'
    }]);
  });
  
  it('should not remove on invalid id', () => {
    const removedUser = users.removeUser(23465764032);

    expect(removedUser).toNotExist();
    expect(users.users).toEqual([{
      id: 123,
      name: 'Bob',
      room: 'Node'
    }, {
      id: 321,
      name: 'John',
      room: 'React'
    }, {
      id: 456,
      name: 'Jen',
      room: 'Node'
    }]);
  });

  it('should find a user', () => {
    const user = users.getUser(123);

    expect(user).toEqual({
      id: 123,
      name: 'Bob',
      room: 'Node'
    });
  });

  it('should not find user on invalid id', () => {
    const user = users.getUser(12332578886234);

    expect(user).toNotExist();
  });

});
