<script lang="ts">
  import type { APIItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

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
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">API Name</span>
        </div>
        <input type="text" placeholder="api name" bind:value={newData.apiName} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">API Group</span>
        </div>
        <input type="text" placeholder="api group" bind:value={newData.apiGroup} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Endpoint</span>
        </div>
        <input type="text" placeholder="endpoint" bind:value={newData.endpoint} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <input type="text" placeholder="description" bind:value={newData.description} class="input input-bordered w-full max-w-xs" />
      </label>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
