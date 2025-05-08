type EnvConfig = {
  default?: string,
};

const envConfig:Record<EnvKey, EnvConfig|string> = {
  DEFAULT_APP: '0',
  DEFAULT_API_HOST: 'http://127.0.0.1',
  API_HOST_LIST: 'http://127.0.0.1,Local;https://api-beta.baskit.app/v2,Beta',
};

function getEnv(key: EnvKey): string {
  {
    const value = import.meta.env[`VITE_${key}`];
    if (value) {
      return value;
    }
  }
  const config = envConfig[key];
  if (typeof config === 'string') {
    return config;
  } else if (config.default) {
    return config.default;
  }
  throw new Error(`Environment variable ${key} is not defined`);
}

export const apiEnv = {
  DEFAULT_APP: Number(getEnv('DEFAULT_APP')),
  DEFAULT_API_HOST: getEnv('DEFAULT_API_HOST'),
  API_HOST_LIST: getEnv('API_HOST_LIST').split(';').map(
    (host) => host.split(',') as [string, string],
  ),
} as const satisfies Record<EnvKey, unknown>;;
