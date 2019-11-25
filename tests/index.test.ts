import { expect } from 'chai';
import 'mocha';
import Errors from 'eratum';

import { insertIf, randomString, SYMOBOLS } from '../sources';

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
});
