<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';

  type Props = {
    client: AxiosInstance;
    dialog?: HTMLDialogElement;
    onsuccess?: (data: unknown) => void;
  };
  let {
    client,
    dialog = $bindable(),
    onsuccess,
  }: Props = $props();

  const payload = $state({
    apiName: '',
    apiGroup: '',
    endpoint: '',
  });

  const onAdded = async (data: unknown) => {
    if (onsuccess) {
      onsuccess(data);
    }
    dialog?.close();
  };
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <FormWrapper
      path="/api"
      {client}
      {payload}
      onsuccess={onAdded}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">API Name</span>
        </div>
        <input type="text" placeholder="api name" bind:value={payload.apiName} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">API Group</span>
        </div>
        <input type="text" placeholder="api group" bind:value={payload.apiGroup} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Endpoint</span>
        </div>
        <input type="text" placeholder="group" bind:value={payload.endpoint} class="input input-bordered w-full max-w-xs" />
      </label>
      <div class="label"></div>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
