<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import type { Writable } from 'svelte/store';
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  type Props = {
    client?: AxiosInstance,
    store?: Writable<AuthStore>,
    path?: string,
    data?: object,
    class?: string,
    onsuccess?: (data: ResponseType) => void,
    children?: Snippet,
  };
  let {
    client,
    store,
    path = '',
    data = $bindable({}),
    class: clazz = '',
    onsuccess = () => undefined,
    children,
  }: Props = $props();

  const onclick = async () => {
    if (!client) return;
    if ($store && !$store.loggedIn) {
      return stringToast('Not logged in');
    }
    const response = await client.post(
      path,
      data,
    );
    if (response.status === 200) {
      onsuccess(response.data);
    }
  };
</script>

<button
  {onclick}
  class={cn('btn bg-slate-600', clazz)}
>
  {#if children}
    {@render children()}
  {/if}
</button>
