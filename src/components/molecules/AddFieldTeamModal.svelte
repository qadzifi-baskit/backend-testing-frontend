<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import PostButton from '../atoms/PostButton.svelte';
  import type { CreateFieldTeamResponse } from '@/types/user';
  import type { Writable } from 'svelte/store';
  import type { AuthStore, Role } from '@/types';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    client: AxiosInstance,
    roleName: string|string[],
    companyId?: string,
    store?: Writable<AuthStore>,
    dialog: HTMLDialogElement|undefined,
  };
  let {
    client,
    roleName,
    store,
    companyId,
    dialog = $bindable(),
  }:Props = $props();

  let data = $state({
    phone: '',
    firstName: '',
    lastName: '',
    roleName,
  });
  let selectedRole = $state('');
  if (typeof roleName === 'string') {
    selectedRole = roleName;
  } else {
    selectedRole = roleName[0];
  }

  async function assignRole(data: CreateFieldTeamResponse) {
    if (companyId === undefined) return;
    if ($store && !$store.loggedIn) return;
    const roleParams = new URLSearchParams({
      roleName: selectedRole,
    });
    const roleResponse = await client.get(
      '/role',
      { params: roleParams },
    );
    if (roleResponse.status !== 200) return;
    const roleList:Role[] = roleResponse.data.data ?? [];
    if (roleList.length === 0) return;
    const roleId = roleList[0].id;
    const assignRoleResponse = await client.post(
      '/company/user',
      {
        companyId,
        roleId,
        userId: data.data.id,
      },
    );
    if (assignRoleResponse.status !== 200) return;
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  {#if typeof roleName === 'string'}
    <span>{roleName}</span>
  {:else}
    <DropdownSelect
      bind:selectValue={selectedRole}
      options={roleName.map((role) => [role, role])}
    />
  {/if}
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">First Name</span>
      </div>
      <input type="text" placeholder="first name" bind:value={data.firstName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Last Name</span>
      </div>
      <input type="text" placeholder="last name" bind:value={data.lastName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Phone</span>
      </div>
      <input type="text" placeholder="phone" bind:value={data.phone} class="input input-bordered w-full max-w-xs" />
    </label>
    <PostButton
      path="/users/field-team"
      bind:data
      onResponse={assignRole}
      {client}
    >
      Add
    </PostButton>
  </div>
</Modal>
