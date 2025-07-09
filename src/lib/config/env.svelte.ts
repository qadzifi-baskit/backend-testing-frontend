import { EnvKeyList } from '@/consts/env.const';
import { Env } from '@/schema/env.schema';

export const apiEnv = Env.parse(Object.fromEntries(
  EnvKeyList.map((key) => [
    key,
    import.meta.env[`VITE_${key}`],
  ]),
));
