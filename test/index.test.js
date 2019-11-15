const { expect } = require('chai');
require('mocha');

const { insertIf } = require('../sources/index.ts');

describe('Javascript tests', () => {
	describe('Test insertIf', () => {
		it('Should retrun empty array if condition is undefined', () => {
			expect(insertIf()).a('array').property('length').equal(0);
		});
	});
});
