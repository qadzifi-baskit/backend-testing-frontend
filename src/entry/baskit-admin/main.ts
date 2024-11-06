import '@/app.css';
import BaskitAdmin from '@/app/baskit-admin';
import { mount } from 'svelte';

const app = mount(BaskitAdmin, {
  target: document.getElementById('app')!,
});

export default app;

