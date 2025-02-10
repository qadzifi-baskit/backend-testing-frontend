/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_API_HOST: string;
  readonly VITE_API_HOST_LIST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
