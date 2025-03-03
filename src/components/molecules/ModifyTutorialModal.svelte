<script lang="ts">
  import { isObjectEmpty } from '@/lib/helper/util';
  import type { Tutorial } from '@/types/tutorial';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    dialog: HTMLDialogElement | undefined,
    item?: Tutorial,
    onsuccess?: (data: Tutorial) => void,
  };
  let {
    client,
    dialog = $bindable(),
    item = $bindable(),
    onsuccess,
  }: Props = $props();

  const newData:Partial<Tutorial> = $state({
    name: '',
    categoryId: '',
    title: '',
    description: '',
    number: 0,
  });

  $effect(() => {
    if (item) {
      newData.name = item.name;
      newData.categoryId = item.categoryId;
      newData.title = item.title;
      newData.description = item.description;
      newData.number = item.number;
    } else {
      newData.name = '';
      newData.categoryId = '';
      newData.title = '';
      newData.description = '';
      newData.number = 0;
    }
  });

  function prehook(payload: Partial<Tutorial>): Partial<Tutorial> {
    if (!item) return payload;
    const newPayload: Partial<Tutorial> = {};
    if (payload.name !== item.name) {
      newPayload.name = payload.name;
    }
    if (payload.categoryId !== item.categoryId) {
      newPayload.categoryId = payload.categoryId ?? null;
    }
    if (payload.title !== item.title) {
      newPayload.title = payload.title;
    }
    if (payload.description !== item.description) {
      newPayload.description = payload.description;
    }
    if (payload.number !== item.number) {
      newPayload.number = payload.number ?? null;
    }
    if (isObjectEmpty(newPayload)) {
      throw new Error('No changes detected');
    }
    return newPayload;
  }

  function onUpdate(data: Tutorial) {
    if (onsuccess) {
      onsuccess(data);
    }
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <FormWrapper
      path={`/tutorial/${item?.id ?? ''}`}
      method="PATCH"
      {client}
      payload={newData}
      {prehook}
      onsuccess={onUpdate}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input type="text" placeholder="name" bind:value={newData.name} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Title</span>
        </div>
        <input type="text" placeholder="title" bind:value={newData.title} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <input type="text" placeholder="description" bind:value={newData.description} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Category Id</span>
        </div>
        <input type="text" placeholder="category id" bind:value={newData.categoryId} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Number</span>
        </div>
        <input type="number" step={1} placeholder="number" bind:value={newData.number} class="input input-bordered w-full max-w-xs" />
      </label>
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>

