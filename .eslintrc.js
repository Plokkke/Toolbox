const ERROR = 'error';
const WARNING = 'warn';
const OFF = 'off';

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/array-type': ERROR,
		'@typescript-eslint/class-methods-use-this': [ERROR, { ignoreClassesThatImplementAnInterface: true }],
		'@typescript-eslint/interface-name-prefix': OFF,
		'@typescript-eslint/explicit-function-return-type': OFF,
		'@typescript-eslint/explicit-module-boundary-types': ERROR,
		'@typescript-eslint/no-explicit-any': ERROR,
		'@typescript-eslint/no-unused-vars': ERROR,
		'@typescript-eslint/prefer-optional-chain': ERROR,
		'@typescript-eslint/ban-ts-comment': [ERROR, { 'ts-expect-error': 'allow-with-description' }],
	},
};
