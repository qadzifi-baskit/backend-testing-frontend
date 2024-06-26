import '@/app.css';
import App from '@/App.svelte';

const app = new App({
  target: document.getElementById('app')!,
  props: {
    entryList: [
      ['/src/entry/buyer/', 'Buyer'],
      ['/src/entry/seller/', 'Seller'],
    ],
  },
});

export default app;


