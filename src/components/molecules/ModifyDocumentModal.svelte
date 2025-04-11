<script lang="ts">
  import { isObjectEmpty } from '@/lib/helper/util';
  import type { Document } from '@/types/document';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    dialog: HTMLDialogElement | undefined,
    item?: Document,
    onsuccess?: () => void,
  };
  let {
    client,
    dialog = $bindable(),
    item = $bindable(),
    onsuccess,
  }: Props = $props();

  const defaultData:Partial<Document> = {
    entityId: '',
    type: '',
    name: '',
  };
  const newData:Partial<Document> = $state({ ...defaultData });

  $effect(() => {
    if (item) {
      Object.assign(newData, item);
    } else {
      Object.assign(newData, defaultData);
    }
  });

  function prehook(payload: Partial<Document>): Partial<Document> {
    if (!item) return payload;
    const newPayload: Partial<Document> = {};
    if (payload.entityId !== item.entityId) {
      newPayload.entityId = payload.entityId;
    }
    if (payload.type !== item.type) {
      newPayload.type = payload.type;
    }
    if (payload.name !== item.name) {
      newPayload.name = payload.name;
    }
    if (isObjectEmpty(newPayload)) {
      throw new Error('No changes detected');
    }
    return newPayload;
  }
</script>

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      path={`/document/${item?.id ?? ''}`}
      method={item ? 'PATCH' : 'POST'}
      {client}
      payload={newData}
      {prehook}
      {onsuccess}
    >
      <FormInput label="Entity Id" readonly bind:value={newData.entityId}/>
      <FormInput label="Type" bind:value={newData.type}/>
      <FormInput label="Name" bind:value={newData.name}/>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
