import { expect } from 'chai';
import 'mocha';
import Errors from 'eratum';

import {
	deepFreeze, insertIf, randomString, SYMOBOLS, iterate,
	arrayIf, asArray, assignAsIf, executeIfDefined, assignmentToPath, firstFulfilled,
} from '../sources';

describe('Typescript tests', () => {
	describe('Test insertIf', () => {
		it('Should not insert element if condition is falsy', () => {
			expect(insertIf(false, 42)).a('array').property('length').equal(0);
		});
		it('Should insert element if condition is truthy', () => {
			expect(insertIf(true, 42)).a('array').property('length').equal(1);
		});
		it('Should insert all elements if condition is truthy', () => {
			expect(insertIf(true, 1, 2, 3)).a('array').property('length').equal(3);
		});
		it('Should allow empty elements even with truthy condition', () => {
			expect(insertIf(true)).a('array').property('length').equal(0);
		});
	});

	describe('Test randomString', () => {
		it('Should fail if symbol has no length', () => {
			try {
				randomString(12, '');
				expect.fail('Should fail if symbol has no length');
			} catch (error) {
				expect(error).instanceOf(Errors.invalid.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('symbols');
				expect(error).property('cause').instanceOf(Errors.equal.class);
				expect(error.cause).property('parameters').a('object');
				expect(error.cause.parameters).property('name').equal('symbols.length');
				expect(error.cause.parameters).property('value').equal(0);
			}
		});
		it('Should build random string with given length', () => {
			const symbol = 'a';
			const length = 42;
			const identifer = randomString(length, symbol);
			expect(identifer).a('string');
			expect(identifer).property('length').equal(length);
			expect(identifer).match(new RegExp(`^${symbol}+$`));
		});
		it('Should use default symbol', () => {
			const length = 10 ** 5;
			const identifer = randomString(length);
			expect(identifer).a('string');
			expect(identifer).property('length').equal(length);
			expect(identifer).match(new RegExp(`^[${SYMOBOLS.ALPHA}]+$`));
		});
	});

	describe('Test deepFreeze', () => {
		it('Should return parameter', () => {
			const a = {};
			const b = deepFreeze(a);
			expect(b).equal(a);
			expect(b).not.equal({});
		});
		it('Should return frozen object', () => {
			const a = {};
			expect(Object.isFrozen(a)).equal(false);
			const b = deepFreeze(a);
			expect(Object.isFrozen(b)).equal(true);
		});
		it('Should return frozen nested object', () => {
			const a = { nested: {} };
			expect(Object.isFrozen(a)).equal(false);
			expect(Object.isFrozen(a.nested)).equal(false);
			Object.freeze(a);
			expect(Object.isFrozen(a)).equal(true);
			expect(Object.isFrozen(a.nested)).equal(false);
			deepFreeze(a);
			expect(Object.isFrozen(a)).equal(true);
			expect(Object.isFrozen(a.nested)).equal(true);
		});
	});

	describe('Test iterate', () => {
		it('Should return iterable array', () => {
			const size = 14;
			let length = 0;
			iterate(size).forEach(() => (length += 1));
			expect(length).equal(size);
		});
	});

	describe('Test arrayIf', () => {
		it('Should return empty array on falsy', () => {
			const array = arrayIf(false, 12, 23, 124);
			expect(array).deep.equal([]);
		});
		it('Should return filled array on truly', () => {
			const input = [ 12, 23, 124 ];
			const array = arrayIf(true, ...input);
			expect(array).deep.equal(input);
		});
	});

	describe('Test asArray', () => {
		it('Should return self array', () => {
			const input = [ 12, 23, 124 ];
			expect(asArray(input)).equal(input);
		});
		it('Should return array containing self', () => {
			const input = { a: 12 };
			const array = asArray(input);
			expect(array.length).equal(1);
			expect(array[0]).equal(input);
		});
	});

	describe('Test assignAsIf', () => {
		it('Should return object on truly', () => {
			const key = 'key';
			const obj = assignAsIf(key, true);
			expect(obj).instanceof(Object).not.equal(null);
			expect(obj![key]).equal(true);
		});
		it('Should return null on falsy', () => {
			const key = 'key';
			expect(assignAsIf(key, false)).equal(null);
		});
	});

	describe('Test executeIfDefined', () => {
		it('Should ignore call on falsy', () => {
			const executor = executeIfDefined((value: boolean) => {
				throw new Error(`Should not be called(${value})`);
			});
			executor(false);
		});
		it('Should forward call on truly', () => {
			const token = 'TOKEN';
			let executed = 'false';
			const executor = executeIfDefined((value: string) => {
				executed = value;
			});
			executor(token);
			expect(executed).equal(token);
		});
	});

	describe('Test assignmentToPath', () => {
		it('Should return function for assignment', () => {
			const object = {};
			const token = 'Hello World';
			const assignment = assignmentToPath(object, 'key');
			expect(assignment).a('function');
			expect(assignment(token)).equal(object)
				.property('key').equal(token);
		});
		it('Should return function for assignment', () => {
			const object = {};
			const token = 'Hello World';
			const assignment = assignmentToPath(object, 'a.b.c');
			expect(assignment).a('function');
			expect(assignment(token)).equal(object)
				.property('a').a('object')
				.property('b').a('object')
				.property('c').equal(token);
		});
	});

	describe('Test firstFulfilled', () => {
		it('Should fulfilled value on single promise', () => {
			return firstFulfilled(Promise.resolve(42))
				.then((data) => expect(data).equal(42));
		});
		it('Should fulfilled first truly value', () => {
			return firstFulfilled(
				Promise.resolve(null),
				() => Promise.resolve(73),
			).then((data) => expect(data).equal(73));
		});
		it('Should not call next promise after fulfillment', () => {
			let token = 'CONST';
			return firstFulfilled(
				Promise.resolve(73),
				() => new Promise(((resolve) => {
					token = 'EDITED';
					resolve();
				})),
			).then(() => expect(token).equal('CONST'));
		});
		it('Should fulfilled first truly value', () => {
			const token = 'Hello World';
			return firstFulfilled<any>(
				Promise.resolve(false),
				() => Promise.resolve(null),
				() => Promise.resolve(''),
				() => Promise.resolve('Hello World'),
			).then((data) => expect(data).equal(token));
		});
		it('Should fulfilled last falsy value', () => {
			return firstFulfilled<any>(
				Promise.resolve(false),
				() => Promise.resolve(null),
				() => Promise.resolve(''),
				() => Promise.resolve(0),
			).then((data) => expect(data).equal(0));
		});
	});
});
