<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { AxiosInstance } from 'axios';
  // eslint-disable-next-line no-undef
  type ResponseType = T;

  let clazz = '';
  export { clazz as class };

  export let path: string;
  export let data: object;
  export let client:AxiosInstance;
  export let onResponse:((data?: ResponseType) => void) = () => undefined;

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
  on:click={onClick}
  class={cn('btn bg-slate-600', clazz)}
>
  <slot/>
</button>
