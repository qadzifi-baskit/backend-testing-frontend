import type { AxiosRequestConfig } from 'axios';
import type { Entry } from './util';

export type BulkCreateInventoryMessage = {
  config: AxiosRequestConfig,
  params?: Entry[],
};

export type HTMLInputEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};

export type HTMLButtonEventHandler = MouseEvent & {
  currentTarget: EventTarget & HTMLButtonElement;
};

export type HTMLDialogToggleEvent = ToggleEvent & {
  currentTarget: EventTarget & HTMLDialogElement;
};
