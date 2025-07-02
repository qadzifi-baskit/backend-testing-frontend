export function DefaultMap<K extends string | number, V>(
  getDefault: () => V,
  initialValue: Partial<Record<K, V>> = {},
): Record<K, V> {
  const store: Partial<Record<K, V>> = { ...initialValue };

  return new Proxy(store as Record<K, V>, {
    get(target, prop: string | symbol) {
      if (typeof prop !== 'string' && typeof prop !== 'number') return undefined;

      if (!(prop in target)) {
        target[prop as K] = getDefault();
      }

      return target[prop as K];
    },
  });
}

