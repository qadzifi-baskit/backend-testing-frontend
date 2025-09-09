<script lang="ts">
  import Modal from '../Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    dialog?: HTMLDialogElement,
    onsuccess?: () => void,
  };
  let {
    dialog = $bindable(),
    onsuccess: onSuccess,
  }: Props = $props();

  const payload = $state({
    name: '',
    description: '',
  });

  function reset() {
    payload.name = '';
    payload.description = '';
  }

  function onsuccess() {
    reset();
    if (onSuccess) {
      onSuccess();
    }
  }
</script>

<Modal bind:dialog title="Add UOM">
  <FormWrapper {payload} path="/uom" {onsuccess}>
    <FormInput label="Name" bind:value={payload.name}/>
    <FormInput label="Desc" bind:value={payload.description}/>
    <SubmitButton/>
  </FormWrapper>
</Modal>
