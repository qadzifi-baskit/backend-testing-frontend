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
      class="*:mb-2"
      path="/api"
      {payload}
      onsuccess={onAdded}
    >
      <span class="fieldset-label">API Name</span>
      <input type="text" placeholder="api name" bind:value={payload.apiName} class="input input-bordered w-full max-w-xs" />
      <span class="fieldset-label">API Group</span>
      <input type="text" placeholder="api group" bind:value={payload.apiGroup} class="input input-bordered w-full max-w-xs" />
      <span class="fieldset-label">Endpoint</span>
      <input type="text" placeholder="group" bind:value={payload.endpoint} class="input input-bordered w-full max-w-xs" />
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
