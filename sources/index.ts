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

export function randomString(length: number, symbols: string = SYMOBOLS.ALPHA): string {
	const safeLength = typeof length === 'number' ? length : 0;
	const safeSymbols = typeof symbols === 'string' ? symbols : SYMOBOLS.ALPHA;
	if (safeLength && !safeSymbols.length) {
		Errors.invalid({ name: 'symbols', origin: 'TOOLBOX', cause: Errors.equal({ name: 'symbols.length', value: safeSymbols.length }) });
	}
	let result = '';
	for (let i = 0; i < safeLength; i += 1) {
		result += safeSymbols.charAt(Math.floor(Math.random() * safeSymbols.length));
	}
	return result;
}

export function stringify(...args: any[]): string {
	return args.map((item) => util.inspect(item, { showHidden: false, depth: null })).join(', ');
}