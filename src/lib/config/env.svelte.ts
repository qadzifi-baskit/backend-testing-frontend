type EnvConfig = {
  default?: string,
};

const envKeyList:(string|[string, EnvConfig])[] = [
  ['VITE_DEFAULT_API_HOST', {}],
  'VITE_API_HOST_LIST',
];
for (const key of envKeyList) {
  if (typeof key === 'string') {
    if (!import.meta.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  } else {
    if (!import.meta.env[key[0]]) {
      throw new Error(`Missing environment variable: ${key[0]}`);
    }
  }
}

export const apiEnv = {
  DEFAULT_API_HOST: import.meta.env.VITE_DEFAULT_API_HOST,
  HOST_LIST: import.meta.env.VITE_API_HOST_LIST.split(';').map(
    (host) => host.split(',') as [string, string],
  ),
};
