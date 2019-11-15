import { expect } from 'chai';
import 'mocha';

import { insertIf } from '../sources';

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
});
