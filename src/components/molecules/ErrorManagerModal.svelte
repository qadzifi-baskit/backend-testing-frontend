<script lang="ts">
  import '@andypf/json-viewer';
  import { axiosErrorStore } from '@/store/store';
  import Modal from '../Modal.svelte';
  import Fuse from 'fuse.js';
  import SearchField from '../atoms/SearchField.svelte';
  import type { AxiosError } from 'axios';

  type Props = {
    dialog?: HTMLDialogElement,
  };
  let {
    dialog = $bindable(),
  }: Props = $props();

  const fuse = new Fuse<AxiosError>([], {
    minMatchCharLength: 0,
    keys: [
      'config.method',
      'config.baseURL',
      'config.url',
    ],
  });

  axiosErrorStore.subscribe((value) => {
    fuse.setCollection(value);
  });

  let search = $state('');
</script>

{#snippet displayError(error: AxiosError)}
  <h2 class="font-mono text-[#fd971f]">
    <span class="font-bold uppercase">
      {error.config?.method ?? ''}
    </span>
    {error.config?.baseURL ?? ''}{error.config?.url ?? ''}
  </h2>
  <andypf-json-viewer data={JSON.stringify(error)} theme="monokai"></andypf-json-viewer>
{/snippet}

<Modal
  bind:dialog
  class="bg-[#272822]"
>
  <h1 class="text-xl font-bold pb-8">Error List</h1>
  <SearchField
    bind:value={search}
  />
  {#if search === ''}
    {#each $axiosErrorStore as error}
      {@render displayError(error)}
    {/each}
  {:else}
    {#each fuse.search(search) as { item: error }}
      {@render displayError(error)}
    {/each}
  {/if}
</Modal>
