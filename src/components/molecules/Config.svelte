<script lang="ts">
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  export let host = 'http://127.0.0.1';
  export let showHost = true;
  export let clientType = 'BASKIT_SHOP';
  export let showClient = true;
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
