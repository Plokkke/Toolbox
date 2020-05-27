const { expect } = require('chai');
require('mocha');

const { insertIf, randomString, iterate } = require('../sources/index.ts');

describe('Javascript tests', () => {
	describe('Test insertIf', () => {
		it('Should retrun empty array if condition is undefined', () => {
			expect(insertIf()).a('array').property('length').equal(0);
		});
	});

	describe('Test randomString', () => {
		it('Should return empty string if length is invalid', () => {
			expect(randomString(null)).equal('');
		});
		it('Should fallback on default if symbols is invalid', () => {
			expect(randomString(12, 14)).a('string').property('length').equal(12);
		});
	});

	describe('Test iterate', () => {
		it('Should return empty array if length is invalid', () => {
			expect(iterate('srbvr')).deep.equal([]);
		});
	});
});
