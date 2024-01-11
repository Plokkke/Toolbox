import util from 'util';

export function instanceOf(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    return typeof data;
  }
  return data.constructor.name;
}

export function insertIf<T>(condition: boolean, ...items: T[]): T[] {
  return condition ? items : [];
}

export function skipFalsy<T>(key: string, value: T): { [key: string]: T } | null {
  return value ? { [key]: value } : null;
}

export function stringify(...args: unknown[]): string {
  return args.map((item) => util.inspect(item, { showHidden: false, depth: null })).join(', ');
}
