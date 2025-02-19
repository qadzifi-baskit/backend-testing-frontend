<script lang="ts">
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import type { Tutorial } from '@/types/tutorial';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import PostButton from '../atoms/PostButton.svelte';

  type Props = {
    client: AxiosInstance;
    store: Writable<AuthStore>;
    onsuccess?: (data: Tutorial) => void,
    dialog?: HTMLDialogElement;
  };
  let {
    client,
    store,
    onsuccess,
    dialog = $bindable(),
  }: Props = $props();

  const data = $state({
    name: '',
    categoryId: '',
    title: '',
    description: '',
    number: 0,
    parentId: '',
  });

  function prehook(payload: Partial<Tutorial>): Partial<Tutorial> {
    if (!$store.loggedIn) {
      stringToast('Not logged in');
      throw new Error('Not logged in');
    }
    const newPayload: Partial<Tutorial> = {
      name: payload.name,
    };
    if (payload.categoryId) {
      newPayload.categoryId = payload.categoryId;
    }
    if (payload.title) {
      newPayload.title = payload.title;
    }
    if (payload.description) {
      newPayload.description = payload.description;
    }
    if (payload.number) {
      newPayload.number = payload.number;
    }
    if (payload.parentId) {
      newPayload.parentId = payload.parentId;
    }
    return newPayload;
  }

  function onTutorialAdded(data: Tutorial) {
    if (onsuccess) {
      onsuccess(data);
    }
    dialog?.close();
  }
</script>

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      class="w-full"
      {client}
      {prehook}
      payload={data}
      path="/tutorial"
      onsuccess={onTutorialAdded}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input type="text" placeholder="name" bind:value={data.name} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Category Id</span>
        </div>
        <input type="text" placeholder="category id" bind:value={data.categoryId} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Title</span>
        </div>
        <input type="text" placeholder="title" bind:value={data.title} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <input type="text" placeholder="description" bind:value={data.description} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Number</span>
        </div>
        <input type="number" placeholder="number" bind:value={data.number} step=1 class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Parent Id</span>
        </div>
        <input type="text" placeholder="parent id" bind:value={data.parentId} class="input input-bordered w-full max-w-xs" />
      </label>
      <PostButton>Add</PostButton>
    </FormWrapper>
  </div>
</Modal>
