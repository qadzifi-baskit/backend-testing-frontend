<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { cancelableDebounce } from '@/lib/helper/util';
  import { BaskitAdminStore } from '@/store/store';
  import type { CompanyType } from '@/types';
  import type { AxiosInstance } from 'axios';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import AddCompanyTypeModal from './AddCompanyTypeModal.svelte';
  import FormInput from '../atoms/FormInput.svelte';

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

  const [debounceGetCompanyType, cancelDebounce] = cancelableDebounce(getCompanyType);

  function reloadData() {
    cancelDebounce();
    getCompanyType();
  }

  listenAuthSuccess(() => {
    getCompanyType();
  });

  $effect(() => {
    name;
    search;
    page = 1;
  });

  $effect(() => {
    if ($BaskitAdminStore.loggedIn) {
      name;
      search;
      page;
      debounceGetCompanyType();
    }
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
  <FormInput label="Name" placeholder="name"/>
  <PaginationNavigationPanel
    bind:max
    bind:page
    bind:search
    onadd={showAddCompannyTypeModal}
    onreload={reloadData}
  />
  {#if companyTypeList.length > 0}
    <Table5
      itemList={companyTypeList}
      {header}
      {content}
    >
    </Table5>
  {/if}
</Collapse>
