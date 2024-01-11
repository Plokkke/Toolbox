import _ from 'lodash';
import { Duration } from 'luxon';
import Errors from 'eratum';
import { DurationUnit } from 'luxon/src/duration';

export const SYMOBOLS = {
  ALPHA_LOWER: 'azertyuiopqsdfghjklmwxcvbn',
  ALPHA_UPPER: 'AZERTYUIOPQSDFGHJKLMWXCVBN',
  ALPHA: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN',
  ALPHA_NUM: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890',
  HEXA: '1234567890ABCDEF',
};

/**
 * Return a random string of the given length using the given charset
 * Use a-zA-Z charset by default
 * If length is not a number or 0 return an empty string
 */
export function randomString(length: number, symbols: string = SYMOBOLS.ALPHA): string {
  const safeLength = typeof length === 'number' ? length : 0;
  const safeSymbols = typeof symbols === 'string' ? symbols : SYMOBOLS.ALPHA;
  if (safeLength && !safeSymbols.length) {
    throw Errors.invalid({ name: 'symbols', origin: 'TOOLBOX', cause: Errors.equal({ name: 'symbols.length', value: safeSymbols.length }) });
  }
  let result = '';
  for (let i = 0; i < safeLength; i += 1) {
    result += safeSymbols.charAt(Math.floor(Math.random() * safeSymbols.length));
  }
  return result;
}

/**
 * Return a random number between min and max included
 * If max is not provided, return a number between 0 and min
 */
export function randomInt(min: number, max: number = 0): number {
  return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
}

/**
 * return a random index between 0 and length - 1
 * The distribution of the index will match the given density
 * The density parameter must be an array of number between 0 and 1 and the sum of all number must be 1
 * No check is done on the density parameter
 * If the sum of the density is not 1, the distribution will be wrong and last index will be picked with the remaining probability
 */
export function randomIdxByDensity(density: number[]): number {
  let rand = Math.random();
  for (let i = 0; i < density.length; rand -= density[i], i += 1) {
    if (rand < density[i]) {
      return i;
    }
  }
  return density.length - 1;
}

/**
 * Return a random index between 0 and length - 1
 * The distribution of the index will match the given weights
 * The density is computed from the weights by dividing each weight by the sum of all weights
 * Then see randIdxOfDensity
 */
export function randomIdxByWeight(weights: number[]): number {
  const sum = _.sum(weights);
  return sum ? exports.randomIdxByDensity(_.map(weights, (weight) => weight / sum)) : -1;
}

export function randomKeyByWeight(record: Record<string, number>): string {
  const entries = Object.entries(record);
  const weights = entries.map(([, weight]) => weight);
  const index = exports.randomIdxByWeight(weights);
  return entries[index][0];
}

/**
 * Return boolean indicating if the given index is picked
 * Following a uniform distribution
 * The index is picked based on cumulative probability considering all previous index as not picked
 * The use case of this function is to iterate over indexes to length until one is picked, otherwise the distribution will not be uniform
 */
export function isIndexPickedUniform(index: number, length: number): boolean {
  return index >= 0 && (index >= length - 1 || Math.random() <= 1 / (length - index));
}

/**
 * Return boolean indicating if the given index is picked matching the given density
 * See isIndexPickedUniform, but with density instead of uniform distribution
 * The density parameter must be an array of number between 0 and 1 and the sum of all number must be 1
 * No check is done on the density parameter
 * If the sum of the density is lower than 1, the last index will be picked with the remaining probability
 * If the sum of the density is greater than 1, the indexes above the sum will never be picked
 */
export function isIndexPicked(index: number, density: number[]): boolean {
  if (index < 0) {
    return false;
  }
  if (index >= density.length - 1) {
    return true;
  }
  const cumulated: number[] = _.transform(
    density,
    (acc: number[], p: number) => {
      acc.push(p + (acc.length ? acc[acc.length - 1] : 0));
    },
    [],
  );
  const iterative = _.map(density, (p, idx) => (idx ? p / (1 - cumulated[idx - 1]) : p));
  return Math.random() <= iterative[index];
}

/**
 * Return a random number between min and max
 */
export function randomDelayInInterval(durationMin: Duration, durationMax: Duration, unit: DurationUnit = 'days'): number {
  return exports.randomInt(durationMin.as(unit), durationMax.as(unit));
}

export function randomItem<T>(items: T[]): T {
  return items[exports.randomInt(items.length - 1)];
}
