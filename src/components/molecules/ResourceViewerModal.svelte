<script lang="ts">
  import Modal from '../Modal.svelte';

  type Props = {
    dialog?: HTMLDialogElement,
    entry?: string,
  };
  let {
    dialog = $bindable(),
    entry = $bindable(),
  }: Props = $props();

  let value = $state(entry);
</script>

<Modal bind:dialog>
  <input type="text" bind:value disabled={!!entry} class="input w-full">
  <object title="Resource" width="400" height="400" data={value} type="application/pdf"></object>
</Modal>
