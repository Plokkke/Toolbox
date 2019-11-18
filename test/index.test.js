const { expect } = require('chai');
require('mocha');

const { insertIf, randomString } = require('../sources/index.ts');

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
		it('Should failed if symbols is invalid', () => {
			expect(randomString(12, null)).a('string').property('length').equal(12);
		});
	});
});
