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
