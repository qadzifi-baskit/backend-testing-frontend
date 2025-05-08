/// <reference types="svelte" />
/// <reference types="vite/client" />
const EnvKey = [
  'DEFAULT_APP',
  'DEFAULT_API_HOST',
  'API_HOST_LIST',
] as const;
type EnvKey = (typeof EnvKey)[number];
type ViteEnvKey = `VITE_${EnvKey}`;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv extends Readonly<Record<ViteEnvKey, string|undefined>> {
  // more env variables...
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
