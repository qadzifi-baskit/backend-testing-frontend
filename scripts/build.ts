import { checkbox } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';
import { InlineConfig, build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = path.resolve(__dirname, '..');
const distPath = path.resolve(root, 'dist');

const AppType = {
  Buyer: 'Buyer',
  Seller: 'Seller',
} as const;

type AppTypeKey = keyof typeof AppType;
type AppType = typeof AppType[AppTypeKey];

const AppEntry:Record<AppTypeKey, string> = {
  Buyer: 'src/entry/buyer/index.html',
  Seller: 'src/entry/seller/index.html',
};

const selectedApp: [AppTypeKey, string][] = await checkbox({
  message: 'Select app to build:',
  choices: Object.entries(AppType).map(([
    key, value,
  ]) => ({
    name: value,
    value: [<AppTypeKey>key, AppEntry[key]],
  })),
});

if (selectedApp.length === 0) {
  console.log('No app selected, exiting process...');
  exit();
}

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
} else {
  if (!fs.statSync(distPath).isDirectory()) {
    fs.rmSync(distPath);
    fs.mkdirSync(distPath);
  }
}

const viteBaseConfig: InlineConfig = {
  root,
  configFile: false,
  plugins: [svelte(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
  },
};
selectedApp.forEach(async ([key, entry]) => {
  await build({
    ...viteBaseConfig,
    build: {
      emptyOutDir: false,
      outDir: 'dist',
      rollupOptions: {
        input: {
          [key]: entry,
        },
      },
    },
  });
});

