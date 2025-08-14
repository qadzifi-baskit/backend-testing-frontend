import type { AppConfigKeyList } from '@/consts/app';
import type { Component } from 'svelte';

export type AppConfigKey = typeof AppConfigKeyList[number];
export type AppConfig = AppConfigKey|AppConfigKey[]|Partial<Record<AppConfigKey, boolean>>;

export type AppTabs = {
  label: string,
  component: Component<{ config: AppConfig }>,
  DEFAULT?: boolean
};

export type AppSettings = {
  tabs: AppTabs[]
  defaultTab?: number
};
