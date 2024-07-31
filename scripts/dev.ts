import { select } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { InlineConfig, createServer } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { AppEntry, AppType } from './enum';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const appList = [
  AppType.Buyer,
  AppType.Seller,
  AppType.SellerInbound,
] as const;

const entry = await select({
  message: 'Select app to build:',
  choices: appList.map((value) => ({
    name: value,
    value: AppEntry[value],
  })),
});

const viteBaseConfig: InlineConfig = {
  root: path.resolve(entry, '..'),
  configFile: false,
  plugins: [
    svelte({
      configFile: path.resolve(__dirname, '..', 'svelte.config.js'),
    }),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
  },
};

const server = await createServer({
  ...viteBaseConfig,
});

if (server) {
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
