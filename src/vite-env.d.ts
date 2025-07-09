/// <reference types="svelte" />
/// <reference types="vite/client" />

import type { EnvKey } from './schema/env.schema';

type ViteEnvKey = `VITE_${EnvKey}`;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv extends Readonly<Record<ViteEnvKey, string|undefined>> {
  // more env variables...
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
