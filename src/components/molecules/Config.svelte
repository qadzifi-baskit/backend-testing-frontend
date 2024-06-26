<script lang="ts">
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  export let host = 'https://api-beta.baskit.app/v2';
  export let clientType = 'BASKIT_SHOP';
</script>

<Collapse title="Config" show>
  <Select
    title="Host"
    showValue
    options={[
      ['http://127.0.0.1', 'Local Host'],
      ['https://api-beta.baskit.app/v2', 'Beta'],
    ]}
    bind:value={host}
  />
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
</Collapse>
