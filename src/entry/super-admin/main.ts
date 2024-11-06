import '@/app.css';
import SuperAdmin from '@/app/super-admin';
import { mount } from 'svelte';

const app = mount(SuperAdmin, {
  target: document.getElementById('app')!,
});

export default app;
