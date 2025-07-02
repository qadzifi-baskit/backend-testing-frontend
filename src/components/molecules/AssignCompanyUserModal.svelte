<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import Modal from '../Modal.svelte';
  import CompanyDropdownSelect from './CompanyDropdownSelect.svelte';
  import UserDropdownSelect from './UserDropdownSelect.svelte';
  import { Context } from '@/lib/helper/context';
  import RoleDropdownSelect from './RoleDropdownSelect.svelte';

  type Props = {
    dialog?: HTMLDialogElement;
  };
  let { dialog = $bindable() }: Props = $props();

  const { client } = Context.strict;

  type Payload = {
    userId?: string,
    companyId?: string,
    roleId?: string,
  };
  const payload:Payload = $state({});
  function resetPayload() {
    payload.userId = undefined;
    payload.companyId = undefined;
    payload.roleId = undefined;
  }

  async function assign() {
    if (!payload.userId || !payload.companyId || !payload.roleId) {
      return stringToast('Please fill in all fields');
    }
    const response = await client.post('/company/user', payload);
    if (response.status !== 200) {
      return stringToast('Failed to assign company user');
    }
    dialog?.close();
    resetPayload();
  }
</script>

<Modal bind:dialog title="Assign Company User">
  <div class="flex flex-col items-start w-full h-full">
    <UserDropdownSelect bind:value={payload.userId}/>
    <CompanyDropdownSelect bind:value={payload.companyId}/>
    <RoleDropdownSelect bind:value={payload.roleId}/>
    <button class="btn btn-secondary mt-4" onclick={assign}>Assign</button>
  </div>
</Modal>
