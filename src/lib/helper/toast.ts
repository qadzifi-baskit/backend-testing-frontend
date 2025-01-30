import Toastify from 'toastify-js';

export function stringToast(text: string, options: Toastify.Options = {}) {
  return Toastify({
    ...options,
    text,
  }).showToast();
}
