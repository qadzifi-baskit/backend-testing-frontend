import { axiosErrorStore, currentModalStore } from '@/store/store';
import type { ErrorResponseData } from '@/types/http';
import type { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import Toastify from 'toastify-js';

let selector:HTMLDialogElement|null = null;

currentModalStore.subscribe((value) => {
  if (value.length === 0) {
    selector = null;
  }
  selector = value[0];
});

export function createAxiosInstance(
  config?: CreateAxiosDefaults,
):AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const toastContainer = document.createElement('div');
      if (!error.response?.data) return error;
      axiosErrorStore.update((errorList) => [error, ...errorList]);

      const data = error.response.data as ErrorResponseData;
      toastContainer.textContent = data.message ?? error.message;

      const options:Toastify.Options = {
        node: toastContainer,
        duration: 3000,
      };

      if (selector) {
        options.selector = selector;
      }
      
      Toastify(options).showToast();
    },
  );

  return instance;
}

export default {
  createAxiosInstance,
};
