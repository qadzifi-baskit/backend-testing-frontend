<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import { BrandUserStore } from '@/store/store';
  import { createPaginationPanelState } from '@/lib/helper/template.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import { debounce } from '@/lib/helper/util';
  import { listenDoAuth } from '@/event';
  import Table5 from '../Table5.svelte';

  type Props = {
    client: AxiosInstance,
  };

  let {
    client,
  }:Props = $props();

  let {
    search,
    max,
    page,
  } = $state(createPaginationPanelState());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let brandList:any = $state([]);

  async function getBrandList() {
    if (!$BrandUserStore.loggedIn) return;
    const response = await client.get('/brand');
    if (response.status !== 200) return;
    brandList = response.data?.data ?? [];
    max = response.data?.page ?? 1;
  }

  const debounceGetBrandList = debounce(getBrandList);

  listenDoAuth(getBrandList);

  $effect(() => {
    search;
    page;
    debounceGetBrandList();
  });

  $inspect(brandList);
</script>

<Collapse
  title="Brand Management"
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onReload={getBrandList}
  />
  <Table5
    itemList={brandList}
  />
</Collapse>
