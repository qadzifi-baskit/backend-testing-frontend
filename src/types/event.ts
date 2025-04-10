import type { AxiosRequestConfig } from 'axios';
import type { Entry } from './util';

export type BulkCreateInventoryMessage = {
  config: AxiosRequestConfig,
  params?: Entry[],
};

export type HTMLButtonEventHandler = MouseEvent & {
  currentTarget: EventTarget & HTMLButtonElement;
};

export type HTMLDialodToggleEvent = ToggleEvent & {
  currentTarget: EventTarget & HTMLDialogElement;
};
