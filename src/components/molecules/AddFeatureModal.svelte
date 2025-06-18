<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { upperSnakeCaseRegexp } from '../../consts/regexp';
  import Modal from '../Modal.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import type { Feature } from '@/types/feature';

  type Props = {
    onsuccess?: (data: Feature) => void,
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
  const { client } = Context.strict;

  function onFeatureAdded(data: Feature) {
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
      path="/feature"
      payload={data}
      onsuccess={onFeatureAdded}
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
