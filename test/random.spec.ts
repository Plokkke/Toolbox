import _ from 'lodash';
import { Duration } from 'luxon';

import * as RandomModule from '@/random';
import { SYMOBOLS } from '@/random';

describe('Random utils', () => {
  describe('randomInt', () => {
    it('Should return a random int between min and max', () => {
      const randMock = jest.spyOn(Math, 'random').mockImplementation(() => 0.5);

      const actual = RandomModule.randomInt(10);
      expect(actual).toBe(5);

      expect(randMock).toHaveBeenCalled();
    });

    it('Should return a random int between min and max', () => {
      const randMock = jest.spyOn(Math, 'random').mockImplementation(() => 0.1);

      const actual = RandomModule.randomInt(10, 20);
      expect(actual).toBe(11);

      expect(randMock).toHaveBeenCalled();
    });

    it('Should return a random int between min and max', () => {
      const randMock = jest.spyOn(Math, 'random').mockImplementation(() => 0.9);

      const actual = RandomModule.randomInt(20, 10);
      expect(actual).toBe(19);

      expect(randMock).toHaveBeenCalled();
    });
  });

  describe('randomString', () => {
    it('should return a random string of the given length with provided symbols', () => {
      const length = 5;
      const symbols = 'ABCD';
      const result = RandomModule.randomString(length, symbols);

      expect(result).toHaveLength(length);
      expect(result.split('').every((char) => symbols.includes(char))).toBeTruthy();
    });

    it('should return an empty string for invalid length values', () => {
      const length = 5;
      const result = RandomModule.randomString(length);

      expect(result).toHaveLength(length);
    });

    it('should return an empty string for invalid length values', () => {
      // @ts-expect-error Testing invalid input
      const result = RandomModule.randomString('invalid', 'ABC');
      expect(result).toBe('');
    });

    it('should use default symbols for invalid symbols', () => {
      const length = 5;
      // @ts-expect-error Testing invalid input
      const result = RandomModule.randomString(length, null);

      expect(result).toHaveLength(length);
      expect(result.split('').every((char) => SYMOBOLS.ALPHA.includes(char))).toBeTruthy();
    });

    it('should throw an error if symbols string is empty', () => {
      expect(() => RandomModule.randomString(5, '')).toThrowError();
    });
  });

  describe('Random index', () => {
    it('randomIdxByDensity', () => {
      const N = 10000;
      const density = [0.1, 0.2, 0.3, 0.4];
      expect(_.sum(density)).toBe(1);

      const selection = _.times(N, () => RandomModule.randomIdxByDensity(density));
      const weights = _(selection)
        .countBy()
        .map((count) => count / N)
        .value();
      const errors = _.map(weights, (weight, idx) => Math.abs(weight - density[idx]));
      expect(_.mean(errors)).toBeLessThan(0.01);
    });

    it('randomIdxByDensity with empty array', () => {
      expect(RandomModule.randomIdxByDensity([])).toEqual(-1);
    });

    it('randomIdxByWeight', () => {
      const weights = [1, 2, 3, 4];
      const expected = [0.1, 0.2, 0.3, 0.4];
      const randomIdxByDensitySpy = jest.spyOn(RandomModule, 'randomIdxByDensity').mockImplementation(() => 0);

      RandomModule.randomIdxByWeight(weights);

      expect(randomIdxByDensitySpy).toHaveBeenCalledWith(expected);
    });

    it('randomIdxByWeight with empty array', () => {
      expect(RandomModule.randomIdxByWeight([])).toBe(-1);
    });

    it('randomIdxByWeight with 0 sum', () => {
      expect(RandomModule.randomIdxByWeight([0])).toBe(-1);
    });
  });

  describe('Is index picked', () => {
    it('Index is never picked if it is negative', () => {
      const actual = _.times(100, () => RandomModule.isIndexPicked(-1, []));
      expect(_.every(actual, (v) => !v)).toBe(true);
    });

    it('Index is always picked if it is the last index', () => {
      const actual = _.times(100, () => RandomModule.isIndexPicked(1, [0.9, 0]));
      expect(_.every(actual, (v) => v)).toBe(true);
    });

    it('Index is picked according to distribution across 5000 samples with 1% error tolerance', () => {
      const N = 5000;
      const expected = [0.1, 0.2, 0.3, 0.4];
      expect(_.sum(expected)).toBeCloseTo(1);

      const counts = _.times(expected.length, () => 0);
      _.times(N, () => {
        let idx = 0;
        while (!RandomModule.isIndexPicked(idx, expected)) {
          idx += 1;
        }
        counts[idx] += 1;
      });

      const actual = _.map(counts, (count) => count / N);
      const errors = _.map(actual, (weight, i) => Math.abs(weight - expected[i]));
      expect(_.mean(errors)).toBeLessThan(0.01);
    });

    it('Index is picked according to computed uniform distribution across 1000 samples with 1% error tolerance', () => {
      const N = 1000;
      const length = 13;
      const expected = _.times(length, () => 1 / length);
      expect(_.sum(expected)).toBeCloseTo(1);

      const counts = _.times(expected.length, () => 0);
      _.times(N, () => {
        let idx = 0;
        while (!RandomModule.isIndexPicked(idx, expected)) {
          idx += 1;
        }
        counts[idx] += 1;
      });

      const actual = _.map(counts, (count) => count / N);
      const errors = _.map(actual, (weight, i) => Math.abs(weight - expected[i]));
      expect(_.mean(errors)).toBeLessThan(0.01);
    });
  });

  describe('isIdxPickedUniform', () => {
    it('Index is never picked if it is negative', () => {
      const actual = _.times(100, () => RandomModule.isIndexPickedUniform(-1, 0));
      expect(_.every(actual, (v) => !v)).toBe(true);
    });

    it('Index is always picked if it is the last index', () => {
      const actual = _.times(100, () => RandomModule.isIndexPickedUniform(1, 2));
      expect(_.every(actual, (v) => v)).toBe(true);
    });

    it('Index is picked according to uniform distribution across 1000 samples with 1% error tolerance', () => {
      const N = 1000;
      const length = 13;
      const expected = _.times(length, () => 1 / length);
      expect(_.sum(expected)).toBeCloseTo(1);

      const counts = _.times(expected.length, () => 0);
      _.times(N, () => {
        let idx = 0;
        while (!RandomModule.isIndexPickedUniform(idx, length)) {
          idx += 1;
        }
        counts[idx] += 1;
      });

      const actual = _.map(counts, (count) => count / N);
      const errors = _.map(actual, (weight, i) => Math.abs(weight - expected[i]));
      expect(_.mean(errors)).toBeLessThan(0.01);
    });
  });

  describe('randomKeyByWeight', () => {
    it('should return the only key if there is only one', () => {
      const record = {
        key: 1,
      };
      expect(RandomModule.randomKeyByWeight(record)).toBe('key');
    });

    it('should return the only key if there is only one', () => {
      const record = {
        key: 1,
        key2: 2,
      };
      const randomIdxByWeightSpy = jest.spyOn(RandomModule, 'randomIdxByWeight').mockImplementation(() => 0);

      RandomModule.randomKeyByWeight(record);

      expect(randomIdxByWeightSpy).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('randomDelayInInterval', () => {
    it('should return a random delay in the given interval', () => {
      const min = Duration.fromISO('P1D');
      const max = Duration.fromISO('P4D');

      const mock = jest.spyOn(RandomModule, 'randomInt');

      RandomModule.randomDelayInInterval(min, max);

      expect(mock).toHaveBeenCalledWith(1, 4);
    });

    it('should return a random delay in the given interval', () => {
      const min = Duration.fromISO('P1D');
      const max = Duration.fromISO('P4D');

      const mock = jest.spyOn(RandomModule, 'randomInt');

      RandomModule.randomDelayInInterval(min, max, 'hours');

      expect(mock).toHaveBeenCalledWith(1 * 24, 4 * 24);
    });
  });

  describe('randomItem', () => {
    it('should return a random item from the given array', () => {
      const items = [1, 2, 3, 4, 5];

      const mock = jest.spyOn(RandomModule, 'randomInt').mockImplementation(() => 2);

      const result = RandomModule.randomItem(items);

      expect(result).toBe(3);
      expect(mock).toHaveBeenCalledWith(4);
    });
  });
});
