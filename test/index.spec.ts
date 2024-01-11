import { insertIf, instanceOf, skipFalsy, stringify } from '../src';

describe('General', () => {
  describe('insertIf', () => {
    it('Should not insert element if condition is falsy', () => {
      expect(insertIf(false, 42)).toStrictEqual([]);
    });
    it('Should insert element if condition is truthy', () => {
      expect(insertIf(true, 42)).toStrictEqual([42]);
    });
    it('Should insert all elements if condition is truthy', () => {
      expect(insertIf(true, 1, 2, 3)).toStrictEqual([1, 2, 3]);
    });
    it('Should allow empty elements even with truthy condition', () => {
      expect(insertIf(true)).toStrictEqual([]);
    });
  });

  describe('instanceOf', () => {
    it('Should return typeof for native type', () => {
      const value = 3;
      const expected = 'number';

      const actual = instanceOf(value);
      expect(actual).toStrictEqual(expected);
    });

    it('Should return typeof for null', () => {
      const value = null;
      const expected = 'object';

      const actual = instanceOf(value);
      expect(actual).toStrictEqual(expected);
    });

    it('Should return instance of custom class', () => {
      class TestClass {}

      const value = new TestClass();
      const expected = 'TestClass';

      const actual = instanceOf(value);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('skipFalsy', () => {
    it('Should return null when arg is falsy', () => {
      const arg = 0;
      const expected = null;
      const actual = skipFalsy('key', arg);

      expect(actual).toStrictEqual(expected);
    });

    it('Should return property set when arg is trully', () => {
      const arg = 7;
      const expected = { key: 7 };
      const actual = skipFalsy('key', arg);

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('stringify', () => {
    it('Should stringify param', () => {
      const arg = { a: true, b: 7 };
      const actual = stringify(arg);

      expect(actual).toStrictEqual('{ a: true, b: 7 }');
    });

    it('Should stringify params', () => {
      const actual = stringify(12, false);

      expect(actual).toStrictEqual('12, false');
    });
  });
});
