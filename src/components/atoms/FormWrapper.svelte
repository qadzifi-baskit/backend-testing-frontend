<script lang="ts" generics="D, T">
  import { Context } from '@/lib/helper/context';
  import { cn } from '@/lib/helper/tailwind';
  import { stringToast } from '@/lib/helper/toast';
  import { isNil } from '@/lib/helper/util';
  import type { RequestMethod } from '@/types/http';
  import type { AxiosRequestConfig } from 'axios';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type DataType = D;
  // eslint-disable-next-line no-undef
  type ResponseType = T;
  type PrehookReturn = DataType|null|undefined;

  type Props = {
    children: Snippet,
    payload: DataType,
    path: string,
    class?: string,
    method?: RequestMethod,
    prehook?: (data: DataType) => PrehookReturn|void|Promise<PrehookReturn|void>,
    onsuccess?: (data: ResponseType) => void,
    params?: URLSearchParams,
    validateStatus?: boolean|null|((status: number) => boolean),
  };
  let {
    payload,
    path,
    method = 'POST',
    class: clazz,
    children,
    prehook,
    onsuccess,
    params = $bindable(),
    validateStatus,
  }:Props = $props();

  export function trigger() {
    console.log('trigger');
  }

  const { auth: store } = Context;
  const { client } = Context.strict;

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    if ($store && !$store.loggedIn) {
      return stringToast('Not logged in');
    }
    let processedPayload = payload;
    if (prehook) {
      const result = await prehook(payload);
      if (isNil(result)) {
        return stringToast('Form prehook failed');
      }
      processedPayload = result;
    }
    const config:AxiosRequestConfig<DataType> = {
      url: path,
      method,
    };
    if (method !== 'GET') {
      config.data = processedPayload;
    }
    if (params) {
      config.params = params;
    }
    if (validateStatus !== undefined) {
      if (typeof validateStatus === 'boolean') {
        config.validateStatus = () => validateStatus;
      } else {
        config.validateStatus = validateStatus;
      }
    }
    stringToast('Submitting...');
    const response = await client(config);
    if (response.status !== 200) return;
    if (onsuccess) onsuccess(response.data?.data);
    stringToast('Success');
  }
</script>

<form {onsubmit} class={cn(clazz)}>
  {@render children()}
</form>
