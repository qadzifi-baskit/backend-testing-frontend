<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { Category } from '@/types/category';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    parentId?: string,
    onsuccess?: (data: Category) => void,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    store,
    parentId = $bindable(),
    onsuccess,
    dialog = $bindable(),
  }:Props = $props();

  const data = $state({
    name: '',
    code: '',
    parentId,
  });

  $effect(() => {
    data.parentId = parentId;
  });

  function prehook(payload: Partial<Category>) {
    if (!$store.loggedIn) {
      stringToast('Not logged in');
      throw new Error('Not logged in');
    }
    return payload;
  }

  function onCategoryAdded(data: Category) {
    if (onsuccess) {
      onsuccess(data);
    }
    dialog?.close();
  }
</script>

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      {client}
      {prehook}
      payload={data}
      path="/category/sub"
      onsuccess={onCategoryAdded}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input type="text" placeholder="name" bind:value={data.name} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Code</span>
        </div>
        <input type="text" placeholder="code" bind:value={data.code} class="input input-bordered w-full max-w-xs" />
      </label>
      {#if parentId}
        <label class="form-control w-full max-w-xs mb-2">
          <div class="label">
            <span class="label-text">Parent Id</span>
          </div>
          <input type="text" disabled placeholder="parent id" bind:value={parentId} class="input input-bordered w-full max-w-xs" />
        </label>
      {/if}
      <SubmitButton>Add</SubmitButton>
    </FormWrapper>
  </div>
</Modal>
