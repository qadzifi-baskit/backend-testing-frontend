<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { createPaginationPanelState } from '@/lib/helper/template.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { NamedEntity } from '@/types';
  import { untrack } from 'svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';
  import EditButton from '../atoms/EditButton.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddUomModal from './AddUOMModal.svelte';
  import ModifyUomModal from './ModifyUOMModal.svelte';

  type Props = {
    show?: boolean,
  };
  let {
    show = $bindable(),
  }:Props = $props();

  let {
    search,
    max,
    page,
  } = $state(createPaginationPanelState());
  let tag = $state('');

  const {
    client,
    auth,
  } = Context.strict;

  let data = $state<NamedEntity[]>([]);

  async function getData() {
    if (!$auth.loggedIn) return stringToast('Not logged in');
    stringToast('Loading UOM Management data...');
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (tag) {
      params.append('tag', tag);
    }
    const response = await client.get('/uom', { params });
    if (response.status !== 200) return stringToast('Failed to load UOM Management data');
    data = response.data.data ?? [];
    stringToast('UOM Management data loaded successfully');
  }

  const [debounceGetData, cancelGetData] = cancelableDebounce(getData);

  function cancelAndReload() {
    cancelGetData();
    debounceGetData();
  }

  $effect(() => {
    if (show) {
      search;
      page = 1;
    }
  });

  $effect(() => {
    if (show) {
      search;
      page;
      untrack(cancelAndReload);
    }
  });

  let addDialog = $state<HTMLDialogElement>();
  function onAdd() {
    addDialog?.showModal();
  }

  let selectedItem = $state<NamedEntity>();
  let modifyDialog = $state<HTMLDialogElement>();
  function onModify(item: NamedEntity) {
    selectedItem = item;
    modifyDialog?.showModal();
  }

  async function onDelete(item: NamedEntity) {
    stringToast(`Deleting UOM ${item.name}...`);
    await client.delete(`/uom/${item.id}`);
    getData();
    stringToast(`UOM ${item.name} deleted successfully`);
  }
</script>

<AddUomModal bind:dialog={addDialog}
  onsuccess={() => {
    addDialog?.close();
    getData();
  }}
/>
<ModifyUomModal bind:dialog={modifyDialog} bind:item={selectedItem}/>
<Collapse5
  title="UOM Management"
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onreload={getData}
    onadd={onAdd}
  />
  <FormInput label="Tag"/>
  <Table5 itemList={data}>
    {#snippet colgroup()}
      <col>
      <col>
      <col class="w-full">
      <col>
    {/snippet}

    {#snippet header()}
      <th>ID</th>
      <th></th>
      <th>Name</th>
      <th></th>
    {/snippet}

    {#snippet content(item)}
      <td class="font-mono"><NoWrap>{item.id}</NoWrap></td>
      <td>
        <EditButton onclick={() => onModify(item)}/>
      </td>
      <td>{item.name}</td>
      <td>
        <DeleteButton onclick={() => onDelete(item)}/>
      </td>
    {/snippet}
  </Table5>
  <div class="divider"></div>
</Collapse5>
