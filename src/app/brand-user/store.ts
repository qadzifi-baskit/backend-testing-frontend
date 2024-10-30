import { writable } from 'svelte/store';

const loggedIn = writable(false);

const BrandUserStore = {
  loggedIn,
};

export default BrandUserStore;
