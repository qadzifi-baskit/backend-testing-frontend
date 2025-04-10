<script lang="ts">
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import Modal from '../Modal.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    companyId: string,
    store: Writable<AuthStore>,
    dialog: HTMLDialogElement|undefined,
    onsuccess?: (data: unknown) => unknown,
  };
  let {
    client,
    store,
    companyId = $bindable(''),
    dialog = $bindable(),
    onsuccess,
  }:Props = $props();

  let data = $state({
    firstName: '',
    lastName: '',
    phone: '',
    companyId,
    companyName: '',
    address: '',
  });

  $effect(() => {
    if (companyId) {
      data.companyId = companyId;
    }
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
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Company Name</span>
      </div>
      <input type="text" placeholder="company name" bind:value={data.companyName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Address</span>
      </div>
      <input type="text" placeholder="address" bind:value={data.address} class="input input-bordered w-full max-w-xs" />
    </label>
    <SubmitButton
      {client}
      {store}
      path="/user-offline"
      bind:data
      {onsuccess}
    >
      Add
    </SubmitButton>
  </div>
</Modal>
