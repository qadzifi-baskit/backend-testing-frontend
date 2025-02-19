<script lang="ts">
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import Collapse5 from '../Collapse5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Table5 from '../Table5.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
  };
  let {
    client,
    store,
  }: Props = $props();

  let search = $state('');
  let page = $state(1);
  let max = $state(1);

  let tutorialList = $state([]);

  function reloadData() {
    console.log('reloadData');
  }

  function showAddModal() {
    console.log('showAddModal');
  }

  $inspect({ client, store });
</script>

<Collapse5
  title="Tutorial Management"
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  {#if tutorialList.length > 0}
    <Table5
      itemList={tutorialList}
    />
  {/if}
</Collapse5>
