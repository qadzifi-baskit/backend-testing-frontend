<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import type { CompanyType } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import SearchField from '../atoms/SearchField.svelte';
  import { debounce } from '@/lib/helper/util';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import AddCompanyTypeModal from './AddCompanyTypeModal.svelte';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }: Props = $props();

  let companyTypeList:CompanyType[] = $state([]);
  let name = $state('');
  let search = $state('');
  let page = $state(1);
  let max = $state(1);

  const getCompanyType = async () => {
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (name.trim() !== '') {
      params.append('name', name);
    }
    const response = await client.get(
      '/company/type',
      {
        params,
      },
    );
    if (response.status !== 200) {
      return;
    }
    companyTypeList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 1;
  };

  const debounceGetCompanyType = debounce(getCompanyType);

  listenAuthSuccess(() => {
    getCompanyType();
  });

  $effect(() => {
    name;
    search;
    page = 1;
  });

  $effect(() => {
    name;
    search;
    page;
    debounceGetCompanyType();
  });

  let addCompanyTypeDialog:HTMLDialogElement|undefined = $state();

  function showAddCompannyTypeModal() {
    addCompanyTypeDialog?.showModal();
  }
</script>

{#snippet header()}
  <th>Id</th>
  <th>Name</th>
  <th>Type</th>
  <th>Parent Id</th>
{/snippet}

{#snippet content(item: CompanyType)}
  <td>{item.id}</td>
  <td>{item.name}</td>
  <td>{item.type}</td>
  <td>{item.parentId}</td>
{/snippet}

<AddCompanyTypeModal
  bind:dialog={addCompanyTypeDialog}
  {client}
  onClose={getCompanyType}
/>
<Collapse
  title="Company Type List"
>
  <PaginationFancyButton
    bind:value={page}
    bind:max
  />
  <label class="form-control w-full max-w-xs mb-2">
    <div class="label">
      <span class="label-text">Name</span>
    </div>
    <input type="text" placeholder="name" bind:value={name} class="input input-bordered w-full max-w-xs" />
  </label>
  <div class="label">
    <span class="label-text">Search</span>
  </div>
  <SearchField
    bind:value={search}
  />
  <button class="btn bordered input-bordered"
    onclick={showAddCompannyTypeModal}
  >
    Add Inventory
  </button>
  {#if companyTypeList.length > 0}
    <Table5
      itemList={companyTypeList}
      {header}
      {content}
    >
    </Table5>
  {/if}
</Collapse>
