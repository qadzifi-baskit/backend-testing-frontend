<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import PaginationFancyButton from './PaginationFancyButton.svelte';
  import SearchField from './SearchField.svelte';

  type Props = {
    search?: string,
    max?: number,
    page?: number,
  };

  let {
    search = $bindable(''),
    max = $bindable(1),
    page = $bindable(1),
  }:Props = $props();

  const debounceResetPage = debounce(() => {
    page = 1;
  });

  $effect(() => {
    search;
    debounceResetPage();
  });
</script>

<SearchField
  bind:value={search}
/>
<PaginationFancyButton
  bind:max
  bind:value={page}
/>
