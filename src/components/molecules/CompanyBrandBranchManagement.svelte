<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { createPaginationPanelState } from '@/lib/helper/template.svelte';
  import type {
    Company,
    CompanyStatus,
  } from '@/types';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddCompanyBrandBranchModal from './AddCompanyBrandBranchModal.svelte';
  import ModifyCompanyBrandBranchModal from './ModifyCompanyBrandBranchModal.svelte';

  type Props = {
    userCompanyId: string,
  };
  let {
    userCompanyId = $bindable(),
  }:Props = $props();

  let {
    search,
    max,
    page,
  } = $state(createPaginationPanelState());

  let branchList:Company[] = $state([]);

  const { client, auth } = Context.strict;

  async function getBranchList() {
    if (!$auth.loggedIn) return;
    const params = new URLSearchParams({
      parentId: userCompanyId,
      search,
      $page: `${page}`,
    });
    const response = await client.get(
      '/company/brand/branch',
      { params },
    );
    if (response.status !== 200) return;
    branchList = response.data?.data ?? [];
  }

  $effect(() => {
    userCompanyId;
    getBranchList();
  });

  let addDialog:HTMLDialogElement|undefined = $state();
  let modifyDialog:HTMLDialogElement|undefined = $state();
  let selectedCompany:Company|undefined = $state();

  function modifyCompany(company: Company) {
    selectedCompany = company;
    modifyDialog?.showModal();
  }

  function toggleStatus(item: Company) {
    return async (e: Event) => {
      const target = e.target as (EventTarget & HTMLInputElement);
      const status:CompanyStatus = target.checked ? 'APPROVED' : 'INACTIVE';
      await client.patch(
        `/company/brand/${item.id}`,
        {
          status,
        },
      );
    };
  }

  $effect(() => {
    if (modifyDialog) {
      modifyDialog.onclose = getBranchList;
    }
  });
  $effect(() => {
    if (addDialog) {
      addDialog.onclose = getBranchList;
    }
  });
</script>

{#snippet header()}
  <th>Id</th>
  <th></th>
  <th>Name</th>
  <th>Address</th>
  <th>PIC</th>
  <th>Status</th>
{/snippet}

{#snippet content(item: Company)}
  <td><NoWrap>{item.id}</NoWrap></td>
  <td>
    <button class="btn btn-secondary"
      onclick={() => modifyCompany(item)}
    >
      <Icon src={FaSolidPencil}/>
    </button>
  </td>
  <td><NoWrap>{item.companyName}</NoWrap></td>
  <td><NoWrap>{item.detail.address}</NoWrap></td>
  <td><NoWrap>{item.detail.personInCharge}</NoWrap></td>
  <td>
    <div class="flex flex-col">
      <div class="form-control w-52">
        <label class="label cursor-pointer">
          <input type="checkbox" class="toggle toggle-primary" checked={item.status === 'APPROVED'}
            onchange={toggleStatus(item)}
          />
        </label>
      </div>
    </div>
  </td>
{/snippet}

<AddCompanyBrandBranchModal
  bind:dialog={addDialog}
  brandId={userCompanyId}
/>
<ModifyCompanyBrandBranchModal
  bind:dialog={modifyDialog}
  company={selectedCompany}
  {client}
/>
<Collapse
  title="Branch Management"
  onclick={getBranchList}
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onreload={getBranchList}
  />
  <button class="btn bordered input-bordered"
    onclick={() => addDialog?.showModal()}
  >
    Add Branch
  </button>
  <Table5
    itemList={branchList}
    {header}
    {content}
  />
</Collapse>
