import { currentModalStore } from '@/store/store';
import Toastify from 'toastify-js';

let selector:HTMLDialogElement|null = null;

currentModalStore.subscribe((value) => {
  if (value.length === 0) {
    selector = null;
  }
  selector = value[0];
});

export function stringToast(text: string, options: Toastify.Options = {}) {
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
