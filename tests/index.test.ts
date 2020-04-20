import { expect } from 'chai';
import 'mocha';
import Errors from 'eratum';

import { deepFreeze, insertIf, randomString, SYMOBOLS } from '../sources';

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
			} catch (error) {
				expect(error).instanceOf(Errors.invalid.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('symbols');
				expect(error).property('cause').instanceOf(Errors.equal.class);
				expect(error.cause).property('origin').equal('TOOLBOX');
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
});
