import util from 'util';
import Errors, { Eratum } from 'eratum';
import * as _ from 'lodash';

export function throwIf(condition: boolean, error: (() => Error) | Error): void {
	if (condition) {
		throw typeof error === 'function' ? error() : error;
	}
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function instanceOf(data: any): string {
	return (data !== undefined && data !== null) ? data.constructor.name : 'undefined';
}

export function arrayIf<T>(condition: boolean, ...items: T[]): T[] {
	return (condition && items) || [];
}

export function asArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [ ...arrayIf(Boolean(value), value) ];
}

export function assignAsIf<T>(key: string, value: T): { [key: string]: T} | null {
	return value ? { [key]: value } : null;
}

export function assignmentToPath(object: Record<string, unknown>, path: string): (value: unknown) => Record<string, unknown> {
	throwIf(typeof object !== 'object', () => Errors.invalidType({ origin: 'TOOLBOX', name: 'object', expectedType: 'object', actualType: typeof object }));
	throwIf(!object, () => Errors.notEqual({ origin: 'TOOLBOX', name: 'object', actualValue: `${object}`, expectedValue: '!null' }));
	throwIf(typeof path !== 'string', () => Errors.invalidType({ origin: 'TOOLBOX', name: 'path', expectedType: 'string', actualType: typeof path }));
	throwIf(path === '', () => Errors.notEqual({ origin: 'TOOLBOX', name: 'path', actualValue: `${path}`, expectedValue: 'not empty' }));

	return (value: unknown): Record<string, unknown> => _.set(object, path, value);
}

export function deepFreeze(item: any = { }): typeof item {
	Object.freeze(item);
	Object.getOwnPropertyNames(item)
		.filter((prop) => !Object.isFrozen(item[prop]))
		.forEach((prop) => deepFreeze(item[prop]));
	return item;
}

export function executeIfDefined<T, R>(executor: (arg: T) => R): (arg: T) => R | undefined {
	if (typeof executor !== 'function') {
		throw Errors.programingFault({ origin: 'TOOLBOX', cause: Errors.invalidType({ name: 'executor', expectedType: 'function', actualType: typeof executor }) });
	}
	return (value: T): R | undefined => (value ? executor(value) : undefined);
}

function firstFulfilledRec<T>(recIndex: number, promise: Promise<T>, ...[ next, ...otherwise ]: (() => Promise<T>)[]): Promise<T> {
	throwIf(!(promise instanceof Promise), () => Errors.invalidType({ origin: 'TOOLBOX', name: `promise[${recIndex}]`, actualType: instanceOf(promise), expectedType: 'Promise' }));

	return promise.then((value) => (value || !next ? value : firstFulfilledRec(recIndex + 1, next(), ...otherwise)));
}

export function firstFulfilled<T>(promise: Promise<T>, ...otherwise: (() => Promise<T>)[]): Promise<T> {
	const errors = otherwise
		.map((next, idx) : Eratum | null => (typeof next !== 'function' ? Errors.invalidType({ name: `otherwise[${idx}]`, expectedType: 'function', actualType: typeof next }) : null))
		.filter(_.identity);
	throwIf(Boolean(errors.length), () => Errors.programingFault({ origin: 'TOOLBOX', cause: Errors.invalid({ name: 'otherwise', cause: errors }) }));

	return firstFulfilledRec(0, promise, ...otherwise);
}

export function insertIf<T>(condition: boolean, ...elements: T[]): T[] {
	return condition ? elements : [];
}

export function iterate(length: number): undefined[] {
	return typeof length === 'number' ? Array.from(new Array(length)) : [];
}

export const SYMOBOLS = {
	ALPHA_LOWER: 'azertyuiopqsdfghjklmwxcvbn',
	ALPHA_UPPER: 'AZERTYUIOPQSDFGHJKLMWXCVBN',
	ALPHA: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN',
	ALPHA_NUM: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890',
	HEXA: '1234567890ABCDEF',
};

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

export function stringify(...args: any[]): string {
	return args.map((item) => util.inspect(item, { showHidden: false, depth: null })).join(', ');
}
