<script lang="ts">
  import { dispatchChangeConfig } from '@/event';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import type { AxiosInstance } from 'axios';
  import { apiEnv } from '@/lib/config/env.svelte';
  import type { AppConfig, AppConfigKey } from '@/types/app';
  import { AppConfigKeyList } from '@/consts/app';

  type Props = {
    host?: string,
    clientType?: string,
    client?: AxiosInstance,
    show?: AppConfig,
  };
  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    clientType = $bindable('BASKIT_SHOP'),
    show = AppConfigKeyList.map((key) => key),
    client,
  }:Props = $props();
  function getConfig(key: AppConfigKey) {
    if (typeof show === 'string') {
      return show === key;
    }
    if (Array.isArray(show)) {
      return show.includes(key);
    }
    if (show) {
      return show[key] ?? false;
    }
    return false;
  }

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
  {#if getConfig('host')}}
    <Select
      title="Host"
      showvalue
      options={apiEnv.API_HOST_LIST}
      bind:value={host}
    />
  {/if}
  {#if getConfig('client')}}
    <Select
      title="Client"
      showvalue
      options={[
        ['BASKIT_SHOP', 'Baskit Shop'],
        ['BASKIT_APP', 'Baskit App'],
        ['WEB_CMS', 'Web CMS'],
      ]}
      bind:value={clientType}
    />
  {/if}
</Collapse>
