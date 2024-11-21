import '@/app.css';
import Seller from '@/app/seller';
import { mount } from 'svelte';

const app = mount(Seller, {
  target: document.getElementById('app')!,
});

export default app;

