import _ from 'lodash';
import Errors from 'eratum';

import { Optional, Transformer } from '@/types';

export function setter<T extends Record<K, unknown>, K extends keyof T>(object: T, key: K): (value: T[K]) => T {
  return _.partial(_.set, object, key) as (value: T[K]) => T;
}

export function getting<T extends Record<K, unknown>, K extends keyof T>(key: K): (object: T) => T[K] {
  return _.partial(_.get, _, key);
}

export function setting<T extends Record<K, unknown>, K extends keyof T>(path: K): (object: T, value: T[K]) => T {
  return _.partial(_.set, _, path) as (object: T, value: T[K]) => T;
}

export function skipFalsy<T, R>(executor: Transformer<T, R>): Transformer<Optional<T>, Optional<R>> {
  if (typeof executor !== 'function') {
    throw Errors.programingFault({ origin: 'TOOLBOX', cause: Errors.invalidType({ name: 'executor', expectedType: 'function', actualType: typeof executor }) });
  }
  return (value: Optional<T>): Optional<R> => (_.isUndefined(value) ? undefined : executor(value));
}
