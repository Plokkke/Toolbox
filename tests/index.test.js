const { expect } = require('chai');
require('mocha');
const { default: Errors } = require('eratum');

const { insertIf, randomString, iterate, executeIfDefined, assignmentToPath,firstFulfilled } = require('../sources/index.ts');

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

	describe('Test executeIfDefined', () => {
		it('Should Throw programing fault if executor is not function', () => {
			try {
				const executor = executeIfDefined('Hello world');
				expect.fail('Should Throw programing fault if executor is not function');
			} catch (error) {
				expect(error).instanceOf(Errors.programingFault.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('cause').instanceOf(Errors.invalidType.class);
				expect(error.cause).property('parameters').a('object');
				expect(error.cause.parameters).property('name').equal('executor');
				expect(error.cause.parameters).property('expectedType').equal('function');
				expect(error.cause.parameters).property('actualType').equal('string');
			}
		});
	});

	describe('Test assignmentToPath', () => {
		it('Should throw error on function object', () => {
			try {
				const obj = assignmentToPath(() => 13, true);
				expect.fail('Should throw error on function object')
			} catch (error) {
				expect(error).instanceOf(Errors.invalidType.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('object');
				expect(error.parameters).property('expectedType').equal('object');
				expect(error.parameters).property('actualType').equal('function');
			}
		});
		it('Should throw error on null object', () => {
			try {
				const obj = assignmentToPath(null, true);
				expect.fail('Should throw error on null object')
			} catch (error) {
				expect(error).instanceOf(Errors.notEqual.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('object');
				expect(error.parameters).property('expectedValue').equal('!null');
				expect(error.parameters).property('actualValue').equal('null');
			}
		});
		it('Should throw error on function path', () => {
			try {
				const obj = assignmentToPath({}, () => 'path');
				expect.fail('Should throw error on function path')
			} catch (error) {
				expect(error).instanceOf(Errors.invalidType.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('path');
				expect(error.parameters).property('expectedType').equal('string');
				expect(error.parameters).property('actualType').equal('function');
			}
		});
		it('Should throw error on empty path', () => {
			try {
				const obj = assignmentToPath({}, '');
				expect.fail('Should throw error on empty path')
			} catch (error) {
				expect(error).instanceOf(Errors.notEqual.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('path');
				expect(error.parameters).property('expectedValue').equal('not empty');
				expect(error.parameters).property('actualValue').equal('');
			}
		});
	});

	describe('Test firstFulfilled', () => {
		it('Should throw error on invalid function fallback', () => {
			try {
				firstFulfilled(Promise.resolve(42), null, 42);
				expect.fail('Should throw error on invalid function fallback')
			} catch (error) {
				expect(error).instanceOf(Errors.programingFault.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('cause').instanceOf(Errors.invalid.class);
				expect(error.cause).property('parameters').a('object');
				expect(error.cause.parameters).property('name').equal('otherwise');

				expect(error.cause).property('cause').instanceof(Array);

				expect(error.cause.cause[0]).instanceOf(Errors.invalidType.class);
				expect(error.cause.cause[0]).property('parameters').a('object');
				expect(error.cause.cause[0].parameters).property('name').equal('otherwise[0]');
				expect(error.cause.cause[0].parameters).property('actualType').equal('object');
				expect(error.cause.cause[0].parameters).property('expectedType').equal('function');

				expect(error.cause.cause[1]).instanceOf(Errors.invalidType.class);
				expect(error.cause.cause[1]).property('parameters').a('object');
				expect(error.cause.cause[1].parameters).property('name').equal('otherwise[1]');
				expect(error.cause.cause[1].parameters).property('actualType').equal('number');
				expect(error.cause.cause[1].parameters).property('expectedType').equal('function');
			}
		});
		it('Should throw error on invalid first promise', () => {
			try {
				return firstFulfilled(42, () => null)
					.then(() => expect.fail('Should throw error on invalid first promise'));
			} catch (error) {
				expect(error).instanceOf(Errors.invalidType.class);
				expect(error).property('origin').equal('TOOLBOX');
				expect(error).property('parameters').a('object');
				expect(error.parameters).property('name').equal('promise[0]');
				expect(error.parameters).property('actualType').equal('Number');
				expect(error.parameters).property('expectedType').equal('Promise');
			}
		});
		it('Should reject error on invalid fallback promise', () => {
			return firstFulfilled(Promise.resolve(false), () => 42)
				.then(() => expect.fail('Should throw error on invalid fallback promise'))
				.catch((error) => {
					expect(error).instanceOf(Errors.invalidType.class);
					expect(error).property('origin').equal('TOOLBOX');
					expect(error).property('parameters').a('object');
					expect(error.parameters).property('name').equal('promise[1]');
					expect(error.parameters).property('actualType').equal('Number');
					expect(error.parameters).property('expectedType').equal('Promise');
				});
		});
	});
});
