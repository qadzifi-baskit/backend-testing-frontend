<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { SellerAdminStore } from '@/store/store';
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import { clamp } from '@/lib/helper/math';
  import { debounce } from '@/lib/helper/util';
  import AddExternalSalesModal from './AddExternalSalesModal.svelte';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  let userList:object[] = $state([]);
  let max = $state(1);
  let page = $state(1);

  async function getExternalSalesman() {
    if (!$SellerAdminStore.loggedIn) return;
    const params = new URLSearchParams({
      $page: `${page}`,
      role: 'EXTERNAL_SALESMAN',
    });
    const response = await client.get(
      '/company/user',
      { params },
    );
    if (response.status !== 200) return;
    userList = response.data?.data ?? [];
    max = clamp(response.data?.totalPage ?? 1, 1);
  }

  const debounceGetExternalSalesman = debounce(getExternalSalesman);

  $effect(() => {
    page;
    debounceGetExternalSalesman();
  });

  listenAuthSuccess(() => {
    getExternalSalesman();
  });

  let addExternalSalesDialog:HTMLDialogElement|undefined = $state();

  function openAddExternalSalesDialog() {
    addExternalSalesDialog?.showModal();
  }

  $effect(() => {
    if (addExternalSalesDialog) {
      addExternalSalesDialog.addEventListener('close', () => {
        getExternalSalesman();
      });
    }
  });
</script>

<AddExternalSalesModal
  bind:dialog={addExternalSalesDialog}
  {client}
/>
<Collapse5
  title="External Salesman"
>
  <PaginationNavigationPanel
    onReload={getExternalSalesman}
    onAdd={openAddExternalSalesDialog}
    bind:max
    bind:page
  />
  <Table5
    itemList={userList}
  />
</Collapse5>

<style>
</style>
