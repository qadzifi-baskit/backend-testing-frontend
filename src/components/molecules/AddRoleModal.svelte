<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import PostButton from '../atoms/PostButton.svelte';
  import Modal from '../Modal.svelte';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
  };
  let { dialog = $bindable(), client }:Props = $props();

  const data = $state({
    roleName: '',
    description: '',
    mongoRoleId: '',
  });

  $effect(() => {
    data.mongoRoleId = data.roleName;
  });

  function onsuccess() {
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Role Name</span>
      </div>
      <input type="text" placeholder="role name" bind:value={data.roleName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Description</span>
      </div>
      <textarea placeholder="description" bind:value={data.description} class="textarea textarea-bordered h-24"></textarea>
    </label>
    <div class="label"></div>
    <PostButton
      path="/role"
      {client}
      {data}
      {onsuccess}
    >
      Create
    </PostButton>
  </div>
</Modal>
