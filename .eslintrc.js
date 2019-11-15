module.exports = {
	extends: [
		'airbnb-base',
	],
	env: {
		node: true,
		mocha: true,
	},
	globals: {
		Promise: 'off',
	},
	parserOptions: {
		ecmaVersion: 9,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true,
			jsx: false,
		},
	},
	rules: {
		'array-bracket-spacing': [ 'error', 'always' ],
		'arrow-body-style': 0,
		'brace-style': [ 'error', '1tbs', { allowSingleLine: false } ],
		'callback-return': 'error',
		camelcase: [ 'error', { properties: 'always' } ],
		'comma-dangle': [ 'error', 'always-multiline', { functions: 'never' } ],
		'consistent-return': [ 'error', { treatUndefinedAsUnspecified: false } ],
		curly: [ 'error', 'all' ],
		eqeqeq: [ 'error', 'always' ],
		'function-paren-newline': [ 'error', 'consistent' ],
		'import/no-dynamic-require': 0,
		indent: [ 'error', 'tab', { ignoredNodes: [ 'ConditionalExpression' ] } ],
		'max-len': [ 1, 200 ],
		'newline-per-chained-call': [ 'off' ],
		'no-bitwise': [ 'error', { allow: [ '^=', '|=', '&=', '<<=', '>>=', '>>>=', '^', '~', '<<', '>>', '>>>' ] } ],
		'no-cond-assign': [ 'error', 'except-parens' ],
		'no-param-reassign': [ 'error', { props: false } ],
		'no-plusplus': [ 'error', { allowForLoopAfterthoughts: true } ],
		'no-return-assign': [ 'error', 'except-parens' ],
		'no-tabs': [ 'off' ],
		'no-shadow': [ 'error', { builtinGlobals: false, hoist: 'functions' } ],
		'no-underscore-dangle': [ 'error', { allowAfterThis: true } ],
		'no-unused-vars': [ 'error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true } ],
		'no-use-before-define': [ 'error', { classes: false } ],
		'nonblock-statement-body-position': [ 'error', 'below' ],
		'object-curly-newline': [ 'error', { consistent: true } ],
		'prefer-const': [ 'error', { destructuring: 'all' } ],
		'prefer-destructuring': [ 'off', { array: false, object: true } ],
		radix: 'error',
		'valid-jsdoc': [ 'error' ],
	},
};
