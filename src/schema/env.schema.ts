import z from 'zod';

export const Env = z.object({
  DEFAULT_APP: z.number().default(0),
  DEFAULT_API_HOST: z.string().default('http://127.0.0.1'),
  API_HOST_LIST: z.string().default('http://127.0.0.1,Local')
    .transform((val) => val.split(';').map(
      (host) => host.split(',') as [string, string],
    )),
});
export type Env = z.infer<typeof Env>;

export type EnvKey = keyof Env;
