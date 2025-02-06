<script lang="ts" generics="D, T">
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { RequestMethod } from '@/types/http';
  import type { AxiosInstance, AxiosRequestConfig } from 'axios';
  import type { Snippet } from 'svelte';
  import type { Writable } from 'svelte/store';
  // eslint-disable-next-line no-undef
  type DataType = D;
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  type Props = {
    children: Snippet,
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    payload: DataType,
    path: string,
    method?: RequestMethod,
    prehook?: (data: DataType) => DataType,
    onsuccess?: (data: ResponseType) => void,
  };
  let {
    client,
    payload,
    store,
    path,
    method = 'POST',
    children,
    prehook,
    onsuccess,
  }:Props = $props();

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    if ($store && !$store.loggedIn) {
      return stringToast('Not logged in');
    }
    let processedPayload = payload;
    if (prehook) {
      processedPayload = prehook(payload);
    }
    const config:AxiosRequestConfig<DataType> = {
      url: path,
      method,
    };
    if (method !== 'GET') {
      config.data = processedPayload;
    }
    const response = await client(config);
    if (response.status !== 200) return;
    if (onsuccess) onsuccess(response.data?.data);
  }
</script>

<form {onsubmit}>
  {@render children()}
</form>
