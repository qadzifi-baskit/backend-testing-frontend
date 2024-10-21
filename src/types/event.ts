import type { AxiosRequestConfig } from 'axios';
import type { Entry } from './util';

export type BulkCreateInventoryMessage = {
  config: AxiosRequestConfig,
  params?: Entry[],
};
