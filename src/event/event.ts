const createEventManager = (name: string): [
  string,
  <T>(detail?: T) => boolean,
  (listener: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions) => void,
] => [
  name,
  <T>(detail?: T) =>
    dispatchEvent(new CustomEvent(name, { detail })),
  (
    listener: EventListenerOrEventListenerObject,
    options?: boolean|AddEventListenerOptions,
  ) =>
    addEventListener(
      name,
      listener,
      options,
    ),
];

export const [
  eventAuthSuccess,
  dispatchAuthSuccess,
  listenAuthSuccess,
] = createEventManager('on-auth-success');

export const [
  eventDoAuth,
  dispatchDoAuth,
  listenDoAuth,
] = createEventManager('on-do-auth');

export const [
  eventConfigChage,
  dispatchChangeConfig,
  listenConfigChange,
] = createEventManager('on-config-change');
