<script lang="ts">
  import type { AuthStore } from '@/types';
  import type { UserOffline } from '@/types/user';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddUserOfflineModal from './AddUserOfflineModal.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    companyId: string,
  };
  let {
    client,
    store,
    companyId = $bindable(''),
  }:Props = $props();
  let userList:UserOffline[] = $state([]);

  async function getCustomerOFflineList() {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams({
      companyId,
    });
    const response = await client.get(
      '/user-offline',
      { params },
    );
    if (response.status !== 200) return;
    userList = response.data?.data ?? [];
  }

  let addUserOfflineModal: HTMLDialogElement|undefined = $state();

  $inspect({ companyId });
</script>

{#snippet header()}
  <th>Id</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>Phone</th>
  <th>Company Name</th>
  <th>Address</th>
{/snippet}

{#snippet content(user: UserOffline)}
  <td><NoWrap>{user.id}</NoWrap></td>
  <td><NoWrap>{user.firstName}</NoWrap></td>
  <td><NoWrap>{user.lastName}</NoWrap></td>
  <td><NoWrap>{user.phone}</NoWrap></td>
  <td><NoWrap>{user.companyName}</NoWrap></td>
  <td><NoWrap>{user.address}</NoWrap></td>
{/snippet}

<AddUserOfflineModal
  {client}
  {store}
  bind:companyId
  bind:dialog={addUserOfflineModal}
/>
<Collapse5
  title="User Offline Management"
>
  <PaginationNavigationPanel
    onreload={getCustomerOFflineList}
    onadd={() => addUserOfflineModal?.showModal()}
  />
  <Table5
    itemList={userList}
    {header}
    {content}
  />
</Collapse5>
