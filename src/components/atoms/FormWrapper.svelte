<script lang="ts">
  import type { RequestMethod } from '@/types/http';
  import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet,
    client: AxiosInstance,
    payload: unknown,
    path: string,
    method?: RequestMethod,
    onsuccess?: (response: AxiosResponse) => void,
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
    if (onsuccess) onsuccess(response);
  }
</script>

<form {onsubmit}>
  {@render children()}
</form>
