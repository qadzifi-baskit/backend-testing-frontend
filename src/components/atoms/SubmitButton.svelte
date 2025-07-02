<script lang="ts" generics="D, T">
  import { cn } from '@/lib/helper/tailwind';
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { RequestMethod } from '@/types/http';
  import type { ButtonType } from '@/types/html';
  import type { AxiosInstance, AxiosRequestConfig } from 'axios';
  import type { Snippet } from 'svelte';
  import type { Writable } from 'svelte/store';
  // eslint-disable-next-line no-undef
  type DataType = D;
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  type Props = {
    client?: AxiosInstance,
    store?: Writable<AuthStore>,
    buttonType?: ButtonType,
    method?: RequestMethod,
    path?: string,
    data?: DataType,
    class?: string,
    prehook?: (data: DataType) => DataType,
    onsuccess?: (data: ResponseType) => void,
    children?: Snippet,
  };
  let {
    client,
    store,
    buttonType = 'submit',
    method = 'POST',
    path = '',
    data = $bindable(),
    class: clazz = '',
    prehook,
    onsuccess,
    children,
  }: Props = $props();

  async function onclick(e: MouseEvent) {
    if (!client || !data) return;
    e.preventDefault();
    if ($store && !$store.loggedIn) {
      return stringToast('Not logged in');
    }
    let processedPayload:DataType = data;
    if (prehook) {
      processedPayload = prehook(data);
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
    if (onsuccess) {
      onsuccess(response.data);
    }
  };
</script>

<button
  type={buttonType}
  {onclick}
  class={cn('btn btn-secondary', clazz)}
>
  {#if children}
    {@render children()}
  {:else}
    Submit
  {/if}
</button>
