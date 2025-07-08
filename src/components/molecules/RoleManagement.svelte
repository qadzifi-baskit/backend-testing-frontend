<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce } from '@/lib/helper/util';
  import type { Role } from '@/types/user';
  import type { Snippet } from 'svelte';
  import EditButton from '../atoms/EditButton.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddRoleModal from './AddRoleModal.svelte';
  import ModifyRoleModal from './ModifyRoleModal.svelte';

  type Props = {
    featureId?: string;
    excludeFeatureId?: string;
    show?: boolean;
    edit?: boolean;
    add?: Snippet|boolean;
    onadd?: () => void;
    reload?: Snippet|boolean;
    modify?: Snippet|boolean;
    onedit?: () => void;
    control?: Snippet<[Role]>;
  };
  let {
    featureId = $bindable(),
    excludeFeatureId = $bindable(),
    show = $bindable(),
    edit = $bindable(),
    add = $bindable(),
    onadd = $bindable(),
    reload = $bindable(),
    modify = $bindable(),
    onedit = $bindable(),
    control = $bindable(),
  }:Props = $props();

  const { client, auth: store } = Context.strict;

  let roleList:Role[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  export async function reloadData() {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (featureId) {
      params.append('featureId', featureId);
    }
    if (excludeFeatureId) {
      params.append('excludeFeatureId', excludeFeatureId);
    }
    const response = await client.get(
      '/role',
      {
        params,
      },
    );
    if (response.status !== 200) return;
    roleList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 0;
  }

  const debounceGetRoleList = debounce(reloadData);

  $effect(() => {
    if (show) {
      page;
      search;
      debounceGetRoleList();
    }
  });

  let addRoleDialog:HTMLDialogElement|undefined = $state();
  function onClickAdd() {
    if (onadd) {
      return onadd();
    }
    return addRoleDialog?.showModal();
  }

  $effect(() => {
    if (addRoleDialog) {
      addRoleDialog.onclose = reloadData;
    }
  });

  let roleDetailDialog = $state<HTMLDialogElement>();
  let selectedAclRoleId = $state('');
  let selectedName = $state('');
  function onClickEdit(role: Role) {
    if (onedit) {
      return () => onedit();
    }

    return () => {
      selectedAclRoleId = role.id;
      selectedName = role.roleName;
      roleDetailDialog?.showModal();
    };
  }
  $inspect(() => {
    if (roleDetailDialog) {
      roleDetailDialog.onclose = () => {
        selectedName = selectedAclRoleId = '';
      };
    }
  });

  let _this:ReturnType<typeof Collapse5>;
  export function open() {
    _this?.open();
  }
</script>

{#if typeof add === 'function'}
  {@render add()}
{:else if add}
  <AddRoleModal
    bind:dialog={addRoleDialog}
    {client}
  />
{/if}
{#if typeof modify === 'function'}
  {@render modify()}
{:else if modify}
  <ModifyRoleModal
    bind:dialog={roleDetailDialog}
    bind:title={selectedName}
    bind:roleid={selectedAclRoleId}
  />
{/if}
<Collapse5
  bind:show
  title="Role Management"
  class="w-full"
  onshow={reloadData}
  bind:this={_this}
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onadd={add ? onClickAdd : undefined}
    onreload={reload ? reloadData : undefined}
  />
  {#if roleList.length > 0}
    <Table5
      itemList={roleList}
    >
      {#snippet colgroup()}
        <col>
        {#if control}
          <col class="w-fit">
        {/if}
        <col>
        <col class="min-w-xs">
        {#if edit}
          <col class="w-full">
        {/if}
      {/snippet}
      {#snippet header()}
        <td>Id</td>
        {#if control}
          <td></td>
        {/if}
        <td>Name</td>
        <td>Desc</td>
        {#if edit}
          <td></td>
        {/if}
      {/snippet}
      {#snippet content(role)}
        <td><NoWrap class="font-mono">{role.id}</NoWrap></td>
        {#if control}
          <td class="flex gap-1">{@render control(role)}</td>
        {/if}
        <td>{role.roleName}</td>
        <td>{role.description}</td>
        {#if edit}
          <td><EditButton onclick={onClickEdit(role)}/></td>
        {/if}
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
