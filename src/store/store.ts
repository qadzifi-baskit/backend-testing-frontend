import type { AuthStore } from '@/types';
import { writable } from 'svelte/store';

export const BrandUserStore = writable<AuthStore>({
  loggedIn: false,
});

export const BaskitAdminStore = writable<AuthStore>({
  loggedIn: false,
});

export const SuperAdminStore = writable<AuthStore>({
  loggedIn: false,
});
