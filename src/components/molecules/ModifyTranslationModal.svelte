<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import type { Translation } from '@/types/translation';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import { isObjectEmpty } from '@/lib/helper/util';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    dialog: HTMLDialogElement | undefined,
    item?: Translation,
    onsuccess?: () => void,
  };
  let {
    client,
    dialog = $bindable(),
    item = $bindable(),
    onsuccess,
  }: Props = $props();

  const newData:Partial<Translation> = $state({
    lang: '',
    platform: '',
    key: '',
    value: '',
  });

  $effect(() => {
    if (item) {
      newData.lang = item.lang;
      newData.platform = item.platform;
      newData.key = item.key;
      newData.value = item.value;
    } else {
      newData.lang = '';
      newData.platform = '';
      newData.key = '';
      newData.value = '';
    }
  });

  function prehook(payload: Partial<Translation>): Partial<Translation> {
    if (!item) return payload;
    const newPayload: Partial<Translation> = {};
    if (payload.lang !== item.lang) {
      newPayload.lang = payload.lang;
    }
    if (payload.platform !== item.platform) {
      newPayload.platform = payload.platform;
    }
    if (payload.key !== item.key) {
      newPayload.key = payload.key;
    }
    if (payload.value !== item.value) {
      newPayload.value = payload.value;
    }
    if (isObjectEmpty(newPayload)) {
      throw new Error('No changes detected');
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
      path={`/translation/${item?.id ?? ''}`}
      method="PATCH"
      {client}
      payload={newData}
      {prehook}
      {onsuccess}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Language</span>
        </div>
        <input type="text" placeholder="language" bind:value={newData.lang} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Platform</span>
        </div>
        <input type="text" placeholder="platform" bind:value={newData.platform} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Key</span>
        </div>
        <input type="text" placeholder="key" bind:value={newData.key} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Value</span>
        </div>
        <input type="text" placeholder="value" bind:value={newData.value} class="input input-bordered w-full max-w-xs" />
        <SubmitButton class="mt-4">Save</SubmitButton>
      </label>
    </FormWrapper>
  </div>
</Modal>
