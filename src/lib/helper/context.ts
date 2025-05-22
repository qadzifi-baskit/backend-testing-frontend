import type { AuthStore } from '@/types';
import type { OrderContext, UserContext } from '@/types/context';
import type { AxiosInstance } from 'axios';
import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

type ContextMap = {
  order?: Writable<OrderContext>,
  user?: Writable<UserContext>,
  auth?: Writable<AuthStore>,
  client?: AxiosInstance,
};

export const Context = {
  get<T extends keyof ContextMap>(key: T): ContextMap[T] {
    return getContext(key);
  },
  getStrict<
    KeyType extends keyof ContextMap,
  >(key: KeyType): Required<ContextMap>[KeyType] {
    const result = getContext(key);
    if (!result) {
      throw new Error(`Context "${key}" is not defined`);
    }
    return result as Required<ContextMap>[KeyType];
  },
  set<T extends keyof ContextMap>(key: T, value: ContextMap[T]): ContextMap[T] {
    return setContext(key, value);
  },
};
