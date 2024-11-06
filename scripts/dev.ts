import { select } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { InlineConfig, createServer } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { AppEntry, AppType } from './enum';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = path.resolve(__dirname, '..');

const appList = [
  AppType.Buyer,
  AppType.Seller,
  AppType.SellerInbound,
  AppType.BaskitAdmin,
  AppType.BrandUser,
  AppType.SuperAdmin,
] as const;

const entry = await select({
  message: 'Select app to build:',
  choices: appList.map((value) => ({
    name: value,
    value: AppEntry[value],
  })),
});

const viteBaseConfig: InlineConfig = {
  envDir: root,
  root: path.resolve(entry, '..'),
  configFile: false,
  plugins: [
    svelte({
      configFile: path.resolve(root, 'svelte.config.js'),
    }),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
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
