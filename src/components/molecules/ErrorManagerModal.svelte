<script lang="ts">
  import '@andypf/json-viewer';
  import { axiosErrorStore } from '@/store/store';
  import Modal from '../Modal.svelte';

  type Props = {
    dialog?: HTMLDialogElement,
  };
  let {
    dialog = $bindable(),
  }: Props = $props();
</script>

<Modal
  bind:dialog
>
  <h1 class="text-xl font-bold">Error List</h1>
  {#each $axiosErrorStore as error}
    <andypf-json-viewer data={JSON.stringify(error)} theme="monokai"></andypf-json-viewer>
  {/each}
</Modal>
