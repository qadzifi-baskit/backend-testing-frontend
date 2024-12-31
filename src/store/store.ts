import type { AuthStore } from '@/types';
import type { AxiosError } from 'axios';
import { writable } from 'svelte/store';

const createAuthStore = () => writable<AuthStore>({
  userId: '',
  loggedIn: false,
});

export const BrandUserStore = createAuthStore();

export const BaskitAdminStore = createAuthStore();

export const SuperAdminStore = createAuthStore();

export const SellerAdminStore = createAuthStore();

export const GrosirSellerStore = createAuthStore();

export const axiosErrorStore = writable<AxiosError[]>([]);
