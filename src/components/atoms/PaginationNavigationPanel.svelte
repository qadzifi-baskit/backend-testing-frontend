<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import PaginationFancyButton from './PaginationFancyButton.svelte';
  import SearchField from './SearchField.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidRotate } from 'svelte-icons-pack/fa';
  import DropdownSelect from './DropdownSelect.svelte';
  import type { PaginationPanelProps } from '@/types/pagination';

  let {
    search = $bindable(''),
    max = $bindable(1),
    page = $bindable(1),
    sort = $bindable(null),
    order = $bindable('ASC'),
    onreload,
    onadd,
    sortOptions = [],
  }:PaginationPanelProps = $props();

  const debounceResetPage = debounce(() => {
    page = 1;
  });

  $effect(() => {
    search;
    debounceResetPage();
  });

  $effect(() => {
    if (!onreload) return;
  });
</script>

<SearchField
  bind:value={search}
/>
<PaginationFancyButton
  bind:max
  bind:value={page}
/>
{#if sortOptions.length > 0}
  <DropdownSelect
    class="w-fit"
    placeholder="SORT"
    bind:value={sort}
    display="LABEL"
    options={[
      [null, 'NONE'],
      ...sortOptions.map(([value, label]):[string, string] => [value, label ?? value]),
    ]}
  />
  <DropdownSelect
    class="w-fit"
    bind:value={order}
    options={[
      ['ASC', 'Ascending'],
      ['DESC', 'Descending'],
    ]}
  />
{/if}
{#if onreload}
  <button
    onclick={onreload}
    class="btn btn-secondary"
  >
    <Icon src={FaSolidRotate}/>
  </button>
{/if}
{#if onadd}
  <button
    onclick={onadd}
    class="btn btn-secondary"
  >
    <Icon src={FaSolidPlus}/>
  </button>
{/if}
