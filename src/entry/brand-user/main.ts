import '@/app.css';
import BrandUser from '@/app/brand-user';
import { mount } from 'svelte';

const app = mount(BrandUser, {
  target: document.getElementById('app')!,
});

export default app;

