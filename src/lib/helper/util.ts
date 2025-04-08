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

// Helper function to check if a value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getObjectDiff<T extends Record<string, unknown>>(a: T, b: T): Partial<T> {
  const diff: Partial<T> = {};

  // Helper function to check if values are deeply equal
  const isDeepEqual = (val1: unknown, val2: unknown): boolean => {
    // Handle primitives
    if (val1 === val2) return true;

    // If one is null/undefined but not both
    if (!val1 || !val2) return false;

    // Handle arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every((item, index) => isDeepEqual(item, val2[index]));
    }

    // Handle objects
    if (isObject(val1) && isObject(val2)) {
      const keys1 = Object.keys(val1);
      const keys2 = Object.keys(val2);

      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => isDeepEqual(val1[key], val2[key]));
    }

    return false;
  };

  // Recursively compare objects
  for (const key in a) {
    if (!(key in b)) {
      diff[key] = a[key];
      continue;
    }

    const aVal = a[key];
    const bVal = b[key];

    if (!isDeepEqual(aVal, bVal)) {
      if (isObject(aVal) && isObject(bVal)) {
        const nestedDiff = getObjectDiff(aVal, bVal);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff as T[Extract<keyof T, string>];
        }
      } else {
        diff[key] = aVal;
      }
    }
  }

  return diff;
}

export function searchStrings(arr: string[], query: string): string[] {
  // Returns an array of indices where each query character is found in order in `str`,
  // or null if the query is not a subsequence of the string.
  function getMatchPositions(str: string, query: string): number[] | null {
    const positions: number[] = [];
    let pos = 0;
    for (let i = 0; i < query.length; i++) {
      pos = str.indexOf(query[i], pos);
      if (pos === -1) {
        return null; // Character not found: query is not a subsequence.
      }
      positions.push(pos);
      pos++; // Continue searching after the current position.
    }
    return positions;
  }

  type Candidate = {
    item: string;
    positions: number[];
  };

  // Map each string to a Candidate object (if it matches) and filter out non-matches.
  const candidates: Candidate[] = arr
    .map((item): Candidate | null => {
      const positions = getMatchPositions(item, query);
      return positions ? { item, positions } : null;
    })
    .filter((candidate): candidate is Candidate => candidate !== null);

  // Sort candidates by:
  // 1. Their positions array (element-by-element comparison).
  // 2. If equal, by the length of the string.
  // 3. If still tied, lexicographically.
  candidates.sort((a, b) => {
    const len = Math.min(a.positions.length, b.positions.length);
    for (let i = 0; i < len; i++) {
      if (a.positions[i] !== b.positions[i]) {
        return a.positions[i] - b.positions[i];
      }
    }
    // If the positions arrays are identical, sort by string length.
    if (a.item.length !== b.item.length) {
      return a.item.length - b.item.length;
    }
    // Finally, sort lexicographically.
    return a.item.localeCompare(b.item);
  });

  // Return the sorted list of matching strings.
  return candidates.map(candidate => candidate.item);
}
