<script lang="ts">
  import type { Document } from '@/types/document';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
    onsuccess?: (data?: Document) => void,
  };
  let {
    client,
    dialog = $bindable(),
    onsuccess: onSuccessParent,
  }:Props = $props();

  const payload:Partial<Document> = $state({});

  function resetData() {
    Object.assign(payload, { entityId: '', type: '', name: '' });
  }

  function onsuccess(data: Document) {
    if (onSuccessParent) {
      onSuccessParent(data);
    }
    dialog?.close();
  }
</script>

<Modal bind:dialog onopen={resetData}>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      class="*:mb-2"
      path="/document"
      {client}
      {payload}
      {onsuccess}
    >
      <FormInput label="Entity ID" placeholder="entity id" bind:value={payload.entityId!}/>
      <FormInput label="Type" placeholder="type" bind:value={payload.type!}/>
      <FormInput label="Name" placeholder="name" bind:value={payload.name!}/>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
