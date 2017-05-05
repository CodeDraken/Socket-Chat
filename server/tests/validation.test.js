const expect = require('expect');

const {isRealString, isNameReserved} = require('../utils/validation');

describe('Validation', () => {

  describe('isRealString', () => {

    it('should reject non-string values', () => {
      const notAString = 123;
      expect(isRealString(notAString)).toBe(false);
    });

    it('should reject string with only spaces', () => {
      const spaces = '    ';
      expect(isRealString(spaces)).toBe(false);
    });

    it('should allow strings with non-space characters', () => {
      const validString = 'CodeDraken';
      expect(isRealString(validString)).toBe(true);
    });

  });

});
