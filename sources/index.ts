import util from 'util';
import Errors from 'eratum';

export function insertIf<T>(condition: boolean, ...elements: T[]): T[] {
	return condition ? elements : [];
}

export const SYMOBOLS = {
	ALPHA_LOWER: 'azertyuiopqsdfghjklmwxcvbn',
	ALPHA_UPPER: 'AZERTYUIOPQSDFGHJKLMWXCVBN',
	ALPHA: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN',
	ALPHA_NUM: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890',
	HEXA: '1234567890ABCDEF',
};

export function randomString(length: number, symbols: string = SYMOBOLS.ALPHA) {
	const _length = typeof length === 'number' ? length : 0;
	const _symbols = typeof symbols === 'string' ? symbols : SYMOBOLS.ALPHA;
	if (_length && !_symbols.length) {
		Errors.invalid({ name: 'symbols', origin: 'TOOLBOX', cause: Errors.equal({ name: 'symbols.length', value: _symbols.length }) });
	}
	let result = '';
	for (let i = 0; i < _length; i += 1) {
		result += _symbols.charAt(Math.floor(Math.random() * _symbols.length));
	}
	return result;
}

export function stringify(...args: any[]) {
	return args.map(item => util.inspect(item, { showHidden: false, depth: null })).join(', ');
}
