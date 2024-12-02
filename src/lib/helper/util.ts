import type { Entry } from '@/types/util';

export function debounce<
  ArgType extends unknown[],
  ReturnType,
>(
  callback: (...args: ArgType) => ReturnType,
  delay = 300,
) {
  let timeoutId: NodeJS.Timeout;
  return (...args: ArgType) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function toURLStringEntries(data: Record<string, unknown>): Entry[] {
  return Object.entries(data).reduce(
    (result, [key, value]) => {
      if (!Array.isArray(value)) {
        return [...result, [key, `${value}`]];
      }

      return [...result, ...value.map<Entry>((item) => [key, `${item}`])];
    },
    <Entry[]>[],
  );
}

export function isObjectEmpty(item: unknown) {
  if (item === undefined || item === null || typeof item !== 'object') {
    throw new Error('Not an object');
  }
  for (const _key in item) {
    return false;
  }
  return true;
}

export function isNil(value: unknown) {
  return value === undefined || value === null;
}
