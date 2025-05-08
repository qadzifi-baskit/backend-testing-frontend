import type { AppConfigKeyList } from '@/consts/app';

export type AppConfigKey = typeof AppConfigKeyList[number];
export type AppConfig = AppConfigKey|AppConfigKey[]|Partial<Record<AppConfigKey, boolean>>;
