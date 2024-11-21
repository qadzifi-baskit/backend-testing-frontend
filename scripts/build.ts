import { checkbox } from '@inquirer/prompts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';
import { BuildOptions, InlineConfig, build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { AppEntry, AppType, AppTypeKey } from './enum';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = path.resolve(__dirname, '..');
const distPath = path.resolve(root, 'dist');
const srcPath = path.resolve(root, 'src');

const buildOptions = await checkbox<string>({
  message: 'Select build options:',
  choices: [
    {
      name: 'Watch mode',
      value: 'watch',
    },
  ],
});
const isWatchMode = buildOptions.includes('watch');

const buildConfig: BuildOptions = {};
if (isWatchMode) {
  buildConfig.watch = {};
  buildConfig.minify = false;
}


const selectedApp: [AppTypeKey, string][] = await checkbox({
  message: 'Select app to build:',
  choices: Object.entries(AppType).map(([
    key, value,
  ]) => ({
    name: value,
    value: <[AppTypeKey, string]>[<AppTypeKey>key, AppEntry[key]],
  })),
});

if (selectedApp.length === 0) {
  console.log('No app selected, exiting process...');
  exit();
}

if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath);

const viteBaseConfig: InlineConfig = {
  configFile: false,
  plugins: [svelte({
    configFile: path.resolve(root, 'svelte.config.js'),
  }), viteSingleFile()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
};

console.log('Building app...');
selectedApp.forEach(async ([key, entry]) => {
  await build({
    ...viteBaseConfig,
    envDir: root,
    mode: 'beta',
    root: path.resolve(entry, '..'),
    build: {
      ...buildConfig,
      emptyOutDir: false,
      outDir: path.resolve(distPath, key),
      rollupOptions: {
        input: {
          [key]: entry,
        },
      },
    },
  });
});

