import { getting, setter, setting, skipFalsy } from '@/functional';

describe('Functional', () => {
  describe('setter', () => {
    it('should set the value of a specified key in an object', () => {
      const obj = { a: 1, b: 2 };
      const setB = setter(obj, 'b');

      expect(setB).toBeInstanceOf(Function);

      setB(3);

      expect(obj.b).toBe(3);
    });
  });

  describe('getting', () => {
    it('should get the value of a specified key in an object', () => {
      const obj = { a: 1, b: 2 };
      const getB = getting<{ b: number }, 'b'>('b');

      expect(getB).toBeInstanceOf(Function);

      expect(getB(obj)).toBe(2);
    });
  });

  describe('setting', () => {
    it('should set the value of a specified key in an object', () => {
      const obj = { a: 1, b: 2 };
      const setB = setting<{ b: number }, 'b'>('b');

      expect(setB).toBeInstanceOf(Function);

      setB(obj, 3);

      expect(obj.b).toBe(3);
    });
  });

  describe('skipFalsy', () => {
    it('should return null if the value is falsy', () => {
      const executor = skipFalsy((val: string) => val);

      expect(executor).toBeInstanceOf(Function);

      const result = executor(undefined);

      expect(result).toBe(undefined);
    });

    it('should return the result of the executor if the value is truthy', () => {
      const executor = skipFalsy((val: string) => val);

      expect(executor).toBeInstanceOf(Function);

      const result = executor('ok');

      expect(result).toBe('ok');
    });

    it('should throw an error if the executor is not a function', () => {
      // @ts-expect-error Testing invalid input
      expect(() => skipFalsy('not a function')).toThrowError();
    });
  });
});
