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
