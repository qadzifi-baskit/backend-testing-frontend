<script lang="ts">
  import { dispatchChangeConfig } from '@/event';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import type { AxiosInstance } from 'axios';
  import { apiEnv } from '@/lib/config/env.svelte';

  type Props = {
    host?: string,
    clientType?: string,
    showHost?: boolean,
    showClient?: boolean,
    client?: AxiosInstance,
  };
  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    clientType = $bindable('BASKIT_SHOP'),
    showHost = true,
    showClient = true,
    client,
  }:Props = $props();

  $effect(() => {
    if (client) {
      client.defaults.baseURL = host;
    }

    dispatchChangeConfig({
      host,
      clientType,
    });
  });
</script>

<Collapse title="Config">
  {#if showHost}
    <Select
      title="Host"
      showValue
      options={apiEnv.HOST_LIST}
      bind:value={host}
    />
  {/if}
  {#if showClient}
    <Select
      title="Client"
      showValue
      options={[
        ['BASKIT_SHOP', 'Baskit Shop'],
        ['BASKIT_APP', 'Baskit App'],
        ['WEB_CMS', 'Web CMS'],
      ]}
      bind:value={clientType}
    />
  {/if}
</Collapse>
