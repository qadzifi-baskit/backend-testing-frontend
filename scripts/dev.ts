import { select } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { InlineConfig, ViteDevServer, createServer } from 'vite';
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
let entry = '';

switch (selectedApp) {
  case AppType.Buyer: {
    entry = 'src/entry/buyer/index.html';
    break;
  }
  case AppType.Seller: {
    entry = 'src/entry/seller/index.html';
    break;
  }
  default:
    break;
}

server = await createServer({
  ...viteBaseConfig,
  server: {
    open: entry,
  },
});

if (server) {
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
