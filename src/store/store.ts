import type { AuthStore } from '@/types';
import { writable } from 'svelte/store';

export const BrandUserStore:AuthStore = writable({
  loggedIn: false,
});

export const BaskitAdminStore:AuthStore = writable({
  loggedIn: false,
});
