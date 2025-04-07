<script lang="ts">
  import { createPaginationPanelState } from '@/lib/helper/template.svelte';
  import { debounce } from '@/lib/helper/util';
  import { BrandUserStore } from '@/store/store';
  import type { Brand, Principal } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { tick } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidRotate, FaSolidTrashCan } from 'svelte-icons-pack/fa';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';

  type Props = {
    client: AxiosInstance,
    userCompanyId: string,
  };

  let {
    client,
    userCompanyId = $bindable(),
  }:Props = $props();

  let {
    search,
    max,
    page,
  } = $state(createPaginationPanelState());

  let brandList:Brand[] = $state([]);
  let selectedPrincipalId = $state('');
  let principalSearch = $state('');
  let principalList:Principal[] = $state([]);

  listenDoAuth(() => {
    selectedPrincipalId = '';
  });

  async function getPrincipalList() {
    if (!$BrandUserStore.loggedIn) return;
    const params = new URLSearchParams({
      search: principalSearch,
    });
    const response = await client.get(
      '/principal',
      { params },
    );
    if (response.status !== 200) return;
    principalList = response.data?.data ?? [];
  }

  async function getBrandList() {
    if (!$BrandUserStore.loggedIn || selectedPrincipalId === '') return;
    const params = new URLSearchParams({
      principalId: selectedPrincipalId,
      companyId: userCompanyId,
      excludeCompany: 'true',
    });
    const response = await client.get(
      '/brand',
      { params },
    );
    if (response.status !== 200) return;
    brandList = response.data?.data ?? [];
    max = response.data?.page ?? 1;
  }

  const debounceGetBrandList = debounce(getBrandList);

  const debounceGetPrincipalList = debounce(getPrincipalList);

  let assignedBrandList:Brand[] = $state([]);

  async function getAssignedBrandList() {
    if (!$BrandUserStore.loggedIn || selectedPrincipalId === '') return;
    const params = new URLSearchParams({
      principalId: selectedPrincipalId,
      companyId: userCompanyId,
    });
    const response = await client.get(
      '/brand',
      { params },
    );
    if (response.status !== 200) return;
    assignedBrandList = response.data?.data ?? [];
  }

  async function assignBrand(brandId: string) {
    if (!$BrandUserStore.loggedIn || selectedPrincipalId === '') return;
    const response = await client.post(
      '/brand/company',
      {
        companyId: userCompanyId,
        brandId,
      },
    );
    if (response.status !== 200) return;
    await getBrandList();
    await getAssignedBrandList();
  }

  async function removeBrand(brandId: string) {
    if (!$BrandUserStore.loggedIn || selectedPrincipalId === '') return;
    const params = new URLSearchParams({
      companyId: userCompanyId,
      brandId,
    });
    const response = await client.delete(
      '/brand/company',
      { params },
    );
    if (response.status !== 200) return;
    await getBrandList();
    await getAssignedBrandList();
  }

  async function getPrincipalId() {
    if (!$BrandUserStore.loggedIn) return;
    const response = await client.patch(
      `/company/brand/${userCompanyId}`,
      {},
    );
    if (response.status !== 200) return;
    selectedPrincipalId = response.data?.data?.principalId ?? '';
  }

  $effect(() => {
    if (userCompanyId !== '') {
      getPrincipalId();
    }
  });

  listenAuthSuccess(async () => {
    await tick();
    getBrandList();
    getAssignedBrandList();
    getPrincipalList();
  });

  $effect(() => {
    search;
    page;
    debounceGetBrandList();
  });

  async function updatePrincipalId() {
    if (!$BrandUserStore.loggedIn || selectedPrincipalId === '') return;
    const response = await client.patch(
      `/company/brand/${userCompanyId}`,
      {
        principalId: selectedPrincipalId,
      },
    );
    if (response.status !== 200) return;
    await getBrandList();
    await getAssignedBrandList();
  }

  $effect(() => {
    selectedPrincipalId;
    updatePrincipalId();
  });

  $effect(() => {
    principalSearch;
    debounceGetPrincipalList();
  });
</script>

{#snippet header()}
  <th>Id</th>
  <th></th>
  <th>Code</th>
  <th>Name</th>
{/snippet}

{#snippet brandContent(brand: Brand)}
  <td><NoWrap>{brand.id}</NoWrap></td>
  <td>
    <button
      class="btn bg-slate-600"
      onclick={() => assignBrand(brand.id)}
    >
      <Icon src={FaSolidPlus}/>
    </button>
  </td>
  <td><NoWrap>{brand.code}</NoWrap></td>
  <td><NoWrap>{brand.name}</NoWrap></td>
{/snippet}

{#snippet assignedBrandContent(brand: Brand)}
  <td><NoWrap>{brand.id}</NoWrap></td>
  <td>
    <button
      class="btn bg-slate-600"
      onclick={() => removeBrand(brand.id)}
    >
      <Icon src={FaSolidTrashCan}/>
    </button>
  </td>
  <td><NoWrap>{brand.code}</NoWrap></td>
  <td><NoWrap>{brand.name}</NoWrap></td>
{/snippet}

{#snippet content()}
  <div class="w-full collapse-content">
    <DropdownSelect
      bind:search={principalSearch}
      bind:value={selectedPrincipalId}
      options={principalList.map((principal) => [principal.id, principal.name])}
      showvalue
      display="LABEL"
      placeholder="principal"
    />
    <button class="btn bg-slate-600"
      onclick={() => selectedPrincipalId = ''}
    >
      <Icon src={FaSolidRotate}/>
    </button>
    <div class="flex">
      <div class="card bg-base-300 rounded-box grid h-fit w-2/5 grow bg-inherit">
        <div class="overflow-x-auto">
          <PaginationNavigationPanel
            bind:search
            bind:max
            bind:page
            onreload={getBrandList}
          />
          {#if selectedPrincipalId !== ''}
            <Table5
              {header}
              content={brandContent}
              itemList={brandList}
            />
          {/if}
        </div>
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="card bg-base-300 rounded-box grid h-fit w-2/5 grow bg-inherit">
        <div class="overflow-x-auto">
          <PaginationNavigationPanel
            bind:search
            bind:max
            bind:page
            onreload={getAssignedBrandList}
          />
          {#if selectedPrincipalId !== ''}
            <Table5
              {header}
              content={assignedBrandContent}
              itemList={assignedBrandList}
            />
          {/if}
        </div>
      </div>
    </div>
  </div>
{/snippet}

<Collapse5
  title="Brand Management"
  {content}
>
</Collapse5>
