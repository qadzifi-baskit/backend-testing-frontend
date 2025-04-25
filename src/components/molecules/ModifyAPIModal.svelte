<script lang="ts">
  import type { APIItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import FormInput from '../atoms/FormInput.svelte';

  type Props = {
    client: AxiosInstance,
    dialog: HTMLDialogElement | undefined,
    item?: APIItem,
    onsuccess?: () => void,
  };
  let {
    client,
    dialog = $bindable(),
    item = $bindable(),
    onsuccess,
  }: Props = $props();

  const newData:Partial<APIItem> = $state({
    apiName: '',
    apiGroup: '',
    endpoint: '',
    description: '',
  });

  $effect(() => {
    if (item) {
      newData.apiName = item.apiName;
      newData.apiGroup = item.apiGroup;
      newData.endpoint = item.endpoint;
      newData.description = item.description;
    } else {
      newData.apiName = '';
      newData.apiGroup = '';
      newData.endpoint = '';
      newData.description = '';
    }
  });

  function prehook(payload: Partial<APIItem>): Partial<APIItem> {
    if (!item) return payload;
    const newPayload: Partial<APIItem> = {
      apiName: payload.apiName,
      apiGroup: payload.apiGroup,
      endpoint: payload.endpoint,
    };
    if (payload.description !== item.description) {
      newPayload.description = payload.description;
    }
    return newPayload;
  }
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <FormWrapper
      path={`/api/${item?.id ?? ''}`}
      method="PATCH"
      {client}
      payload={newData}
      {prehook}
      {onsuccess}
    >
      <span class="label">API Name</span>
      <FormInput bind:value={newData.apiName}/>
      <span class="label">API Group</span>
      <FormInput bind:value={newData.apiGroup}/>
      <span class="label">Endpoint</span>
      <FormInput bind:value={newData.endpoint}/>
      <span class="label">Description</span>
      <FormInput bind:value={newData.description}/>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
