import { select } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import type { InlineConfig, ViteDevServer } from 'vite';
import { createServer } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const AppType = {
  Buyer: 'Buyer',
  Seller: 'Seller',
} as const;

const appList = [
  AppType.Buyer,
  AppType.Seller,
] as const;

type AppType = typeof appList[number];

const selectedApp: AppType = await select({
  message: 'Select app to build:',
  choices: appList.map((value) => ({
    name: value,
    value,
  })),
});

const viteBaseConfig: InlineConfig = {
  root: path.resolve(__dirname, '..'),
  configFile: false,
  plugins: [svelte(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
  },
};
let server: ViteDevServer|undefined = undefined;

switch (selectedApp) {
  case AppType.Buyer: {
    server = await createServer({
      ...viteBaseConfig,
      server: {
        open: 'src/entry/buyer/index.html',
      },
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: {
            buyer: 'src/entry/buyer/index.html',
          },
        },
      },
    });
    break;
  }
  default:
    break;
}

if (server) {
  await server.listen();
  await server.printUrls();
  await server.bindCLIShortcuts({ print: true });
}
