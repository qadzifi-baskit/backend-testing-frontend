import { currentModalStore } from '@/store/store';
import Toastify from 'toastify-js';

const MAX_TOAST = 6;

let selector:HTMLDialogElement|null = null;

currentModalStore.subscribe((value) => {
  if (value.length === 0) {
    selector = null;
  }
  selector = value[0];
});

export function stringToast(text: string, options: Toastify.Options = {}) {
  const toastList = document.querySelectorAll('div.toastify');

  if (toastList.length > MAX_TOAST - 1) {
    toastList.forEach((toast, idx) => {
      if (idx > MAX_TOAST - 2) toast.parentElement?.removeChild(toast);
    });
  }

  const addedOptions: Toastify.Options = {};

  if (selector) {
    addedOptions.selector = selector;
  }

  return Toastify({
    ...addedOptions,
    ...options,
    text,
  }).showToast();
}
