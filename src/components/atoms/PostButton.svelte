<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  type Props = {
    client: AxiosInstance,
    path: string,
    data?: object,
    class?: string,
    onResponse?: (data: ResponseType) => void,
    children?: Snippet,
  };
  let {
    client,
    path,
    data = $bindable({}),
    class: clazz = '',
    onResponse = () => undefined,
    children,
  }: Props = $props();

  const onClick = async () => {
    const response = await client.post(
      path,
      data,
    );
    if (response.status === 200) {
      onResponse(response.data);
    }
  };
</script>

<button
  onclick={onClick}
  class={cn('btn bg-slate-600', clazz)}
>
  {#if children}
    {@render children()}
  {/if}
</button>
