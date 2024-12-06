<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { PaginatialPanelProps } from '@/types';
  import PaginationFancyButton from './PaginationFancyButton.svelte';
  import SearchField from './SearchField.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidRotate } from 'svelte-icons-pack/fa';

  let {
    search = $bindable(''),
    max = $bindable(1),
    page = $bindable(1),
    onreload,
    onadd,
  }:PaginatialPanelProps = $props();

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
<button
  onclick={onreload}
  class="btn bg-slate-600"
>
  <Icon src={FaSolidRotate}/>
</button>
<button
  onclick={onadd}
  class="btn bg-slate-600"
>
  <Icon src={FaSolidPlus}/>
</button>
