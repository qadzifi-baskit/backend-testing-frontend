import type { AuthStore } from '@/types';
import type { OrderContext, UserContext } from '@/types/context';
import type { AxiosInstance } from 'axios';
import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

type ContextMap = {
  order?: Writable<OrderContext>;
  user?: Writable<UserContext>;
  auth?: Writable<AuthStore>;
  client?: AxiosInstance;
};
const ContextKey = Object.keys({
  order: 0,
  user: 0,
  auth: 0,
  client: 0,
} satisfies Record<keyof ContextMap, 0>) as (keyof ContextMap)[];

function createContextHelpers<T extends Record<string, unknown>>() {
  const context = {
    get<K extends keyof T>(key: K): T[K] {
      return getContext(key as string);
    },
    getStrict<K extends keyof T>(key: K): NonNullable<T[K]> {
      const result = getContext(key as string);
      if (!result) {
        throw new Error(`Context "${String(key)}" is not defined`);
      }
      return result as NonNullable<T[K]>;
    },
    set<K extends keyof T>(key: K, value: T[K]): T[K] {
      return setContext(key as string, value);
    },
    strict: {} as Record<keyof T, unknown>,
  };

  // Dynamically add getters for each key in ContextMap
  for (const key of ContextKey) {
    Object.defineProperty(context, key, {
      get() {
        return context.get(key);
      },
    });
    Object.defineProperty(context.strict, key, {
      get() {
        return context.getStrict(key);
      },
    });
  }

  return context as {
    get<K extends keyof T>(key: K): T[K];
    getStrict<K extends keyof T>(key: K): NonNullable<T[K]>;
    set<K extends keyof T>(key: K, value: T[K]): T[K];
  } & {
    [K in keyof T]: T[K];
  } & {
    strict: {
      [K in keyof T]-?: NonNullable<T[K]>;
    };
  };
}

// Create the Context object
export const Context = createContextHelpers<ContextMap>();

