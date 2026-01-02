import type { Guard } from '@/shared/api/types';

export const isString: Guard<string> = (x): x is string => typeof x === 'string';

export const isStringArray: Guard<string[]> = (x): x is string[] =>
  Array.isArray(x) && x.every((v) => typeof v === 'string');

export const isNull: Guard<null> = (x): x is null => x === null;
