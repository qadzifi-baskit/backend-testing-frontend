import Toastify from 'toastify-js';
import type { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import type { ErrorResponseData } from '@/types/http';
import { axiosErrorStore } from '@/store/store';

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
      
      Toastify({
        node: toastContainer,
        duration: 3000,
      }).showToast();
    },
  );

  return instance;
}

export default {
  createAxiosInstance,
};
