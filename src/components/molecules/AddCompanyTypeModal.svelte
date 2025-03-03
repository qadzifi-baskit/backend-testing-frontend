<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import type { EventHandler } from 'svelte/elements';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
    onClose?: EventHandler<Event, HTMLDialogElement>,
  };

  let {
    client,
    dialog = $bindable(),
    onClose,
  }: Props = $props();

  const data = $state({
    name: '',
    type: '',
  });

  function onsuccess() {
    data.name = '';
    data.type = '';
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
  onclose={onClose}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Name</span>
      </div>
      <input type="text" placeholder="name" bind:value={data.name} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Type</span>
      </div>
      <input type="text" placeholder="type" bind:value={data.type} class="input input-bordered w-full max-w-xs" />
    </label>
    <SubmitButton
      path="/company/type"
      {client}
      {data}
      {onsuccess}
    >
      Add
    </SubmitButton>
  </div>
</Modal>
