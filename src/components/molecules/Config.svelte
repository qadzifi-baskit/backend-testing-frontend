<script lang="ts">
  import { dispatchChangeConfig } from '@/event';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import type { AxiosInstance } from 'axios';

  type Props = {
    host?: string,
    clientType?: string,
    showHost?: boolean,
    showClient?: boolean,
    client?: AxiosInstance,
  };
  let {
    host = $bindable('http://127.0.0.1'),
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
      options={[
        ['http://127.0.0.1', 'Local Host'],
        ['https://api-beta.baskit.app/v2', 'Beta'],
      ]}
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
