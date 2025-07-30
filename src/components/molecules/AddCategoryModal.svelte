<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Category } from '@/types/category';
  import Modal from '../Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    parentId?: string,
    onsuccess?: (data: Category) => void,
    dialog?: HTMLDialogElement,
  };
  let {
    parentId = $bindable(),
    onsuccess,
    dialog = $bindable(),
  }:Props = $props();

  const { auth } = Context.strict;

  const data = $state({
    name: '',
    code: '',
    parentId,
    type: 'CATEGORY',
  });

  $effect(() => {
    data.parentId = parentId;
  });

  function prehook(payload: Partial<Category>) {
    if (!$auth.loggedIn) {
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
      {prehook}
      payload={data}
      path="/category"
      onsuccess={onCategoryAdded}
    >
      <FormInput type="text" label="Name" placeholder="name" bind:value={data.name}/>
      <FormInput type="text" label="Code" placeholder="code" bind:value={data.code}/>
      {#if parentId}
        <label class="form-control w-full max-w-xs mb-2">
          <div class="label">
            <span class="label-text">Parent Id</span>
          </div>
          <input type="text" disabled placeholder="parent id" bind:value={parentId} class="input input-bordered w-full max-w-xs" />
        </label>
      {/if}
      <label>
        <span class="fieldset-label mb-2 capitalize">Type</span>
        <DropdownSelect
          options={[
            ['CATEGORY', 'Category'],
            ['SUB', 'Subategory'],
            ['SEGMENT', 'Segment'],
            ['PRODUCT_TYPE', 'Product Type'],
          ]}
          bind:value={data.type}
        />
      </label>
      <SubmitButton class="mt-2">Add</SubmitButton>
    </FormWrapper>
  </div>
</Modal>
