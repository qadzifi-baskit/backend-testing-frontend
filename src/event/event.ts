const createEventManager = (name: string): [
  string,
  <T>(detail?: T, target?: HTMLElement) => boolean,
  (
    listener: EventListenerOrEventListenerObject,
    options?: boolean|AddEventListenerOptions,
    target?: HTMLElement,
  ) => void,
] => [
  name,
  <T>(detail?: T, target?: HTMLElement): boolean => {
    if (target) {
      return target.dispatchEvent(new CustomEvent(name, { detail }));
    }
    return dispatchEvent(new CustomEvent(name, { detail }));
  },
  (
    listener: EventListenerOrEventListenerObject,
    options?: boolean|AddEventListenerOptions,
    target?: HTMLElement,
  ): void => {
    if (target) {
      return target.addEventListener(
        name,
        listener,
        options,
      );
    }
    return addEventListener(
      name,
      listener,
      options,
    );
  },
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

export const [
  eventUpdateMemberLevel,
  dispatchUpdateMemberLevel,
  listenUpdateMemberLevel,
] = createEventManager('on-update-member-level');

export const [
  eventOpenCartDraftDetail,
  dispatchOpenCartDraftDetail,
  listenOpenCartDraftDetail,
] = createEventManager('on-open-cart-draft-detail');

export const [
  eventGetPaymentTypeList,
  dispatchGetPaymentTypeList,
  listenGetPaymentTypeList,
] = createEventManager('on-get-payment-type-list');
