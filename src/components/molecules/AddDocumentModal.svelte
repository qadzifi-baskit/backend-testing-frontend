<script lang="ts">
  import type { Document } from '@/types/document';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import type { UploadFileResponseData } from '@/types/http';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
    onsuccess?: (data?: Document) => void,
    entityid?: string,
  };
  let {
    client,
    dialog = $bindable(),
    onsuccess: onSuccessParent,
    entityid: entityId = $bindable(),
  }:Props = $props();

  const payload:Partial<Document> = $state({});
  let file = $state<FileList>();

  function resetData() {
    Object.assign(payload, { entityId: entityId ?? '', type: '', name: '' });
  }

  function onsuccess(data: Document) {
    if (onSuccessParent) {
      onSuccessParent(data);
    }
    dialog?.close();
  }

  async function prehook(data: Partial<Document>) {
    if (!file || file.length === 0) {
      stringToast('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file[0]);
    const response = await client.post('/upload', formData, {
      params: {
        folder: 'baskit-documents',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200) {
      stringToast('Failed to upload file');
      return;
    }
    const result:UploadFileResponseData = response.data.data;
    if (!result) {
      stringToast('Failed to upload file');
      return;
    }
    return {
      ...data,
      name: result.fileName,
    };
  }
</script>

<Modal bind:dialog onopen={resetData}>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      class="*:mb-2"
      path="/document"
      {client}
      {payload}
      {prehook}
      {onsuccess}
    >
      <FormInput readonly={!!entityId} label="Entity ID" placeholder="entity id" bind:value={payload.entityId!}/>
      <FormInput label="Type" placeholder="type" bind:value={payload.type!}/>
      <span class="fieldset-label">File</span>
      <input type="file" class="file-input" bind:files={file}>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
