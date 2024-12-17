<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import PostButton from '../atoms/PostButton.svelte';

  type Props = {
    client: AxiosInstance,
    roleName: string,
    dialog: HTMLDialogElement|undefined,
  };
  let {
    client,
    roleName,
    dialog = $bindable(),
  }:Props = $props();

  let data = $state({
    phone: '',
    firstName: '',
    lastName: '',
    roleName,
  });
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Phone</span>
      </div>
      <input type="text" placeholder="phone" bind:value={data.phone} class="input input-bordered w-full max-w-xs" />
    </label>
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
    <PostButton
      path="/users/field-team"
      bind:data
      {client}
    >
      Add
    </PostButton>
  </div>
</Modal>
