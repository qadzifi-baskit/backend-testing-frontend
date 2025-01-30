<script lang="ts" generics="T">
  import type { RequestMethod } from '@/types/http';
  import type { AxiosInstance, AxiosRequestConfig } from 'axios';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  type Props = {
    children: Snippet,
    client: AxiosInstance,
    payload: unknown,
    path: string,
    method?: RequestMethod,
    onsuccess?: (data: ResponseType) => void,
  };
  let {
    client,
    payload,
    path,
    method = 'POST',
    children,
    onsuccess,
  }:Props = $props();

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    const config:AxiosRequestConfig<unknown> = {
      url: path,
      method,
    };
    if (method !== 'GET') {
      config.data = payload;
    }
    const response = await client(config);
    if (response.status !== 200) return;
    if (onsuccess) onsuccess(response.data?.data);
  }
</script>

<form {onsubmit}>
  {@render children()}
</form>
