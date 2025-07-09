import type { EnvKey } from '@/schema/env.schema';

export const EnvKeyList = [
  'DEFAULT_APP',
  'DEFAULT_API_HOST',
  'API_HOST_LIST',
] as const satisfies EnvKey[];
