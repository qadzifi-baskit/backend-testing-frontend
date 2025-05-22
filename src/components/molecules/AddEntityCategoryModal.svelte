<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import type { EntityCategory } from '@/types/entityCategory';
  import { upperSnakeCaseRegexp } from '../../consts/regexp';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import FormInput from '../atoms/FormInput.svelte';

  type Props = {
    onsuccess?: (data: EntityCategory) => void,
    dialog?: HTMLDialogElement,
  };

  let {
    onsuccess,
    dialog = $bindable(),
  }:Props = $props();

  const data = $state({
    name: '',
    label: '',
    description: '',
  });
  const client = Context.getStrict('client');

  function onCategoryAdded(data: EntityCategory) {
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
      {client}
      path="/entity-category"
      payload={data}
      onsuccess={onCategoryAdded}
    >
      <FormInput
        bind:value={data.name}
        label="Name"
        placeholder="Name"
        pattern={upperSnakeCaseRegexp.source}
        min={1}
        required
      >
        {#snippet error()}
          <ul class="validator-hint list-disc list-inside">
            <li>Name must be in upper snake case pattern</li>
            <li>Name minimum length is 1</li>
          </ul>
        {/snippet}
      </FormInput>
      <FormInput
        bind:value={data.label}
        label="Label"
        placeholder="Label"
      />
      <span class="fieldset-label">Description</span>
      <textarea class="input block resize" bind:value={data.description}></textarea>
      <SubmitButton class="mt-4"/>
    </FormWrapper>
  </div>
</Modal>
