import type { OrderContext } from '@/types/context';
import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

type ContextMap = {
  order?: Writable<OrderContext>;
};

export const Context = {
  get<T extends keyof ContextMap>(key: T): ContextMap[T] {
    return getContext(key);
  },
  set<T extends keyof ContextMap>(key: T, value: ContextMap[T]): ContextMap[T] {
    return setContext(key, value);
  },
};
