<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import PaginationFancyButton from './PaginationFancyButton.svelte';
  import SearchField from './SearchField.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidRotate } from 'svelte-icons-pack/fa';
  import DropdownSelect from './DropdownSelect.svelte';
  import type { PaginationPanelProps } from '@/types/pagination';

  let {
    search = $bindable(),
    max = $bindable(1),
    limit = $bindable(),
    page = $bindable(),
    sort = $bindable(null),
    order = $bindable('ASC'),
    onreload,
    onadd,
    sortOptions = [],
    orderOptions,
  }:PaginationPanelProps = $props();

  const debounceResetPage = debounce(() => {
    if (page !== undefined) {
      page = 1;
    }
  });

  $effect(() => {
    search;
    debounceResetPage();
  });

  $effect(() => {
    if (!onreload) return;
  });
</script>

{#if search !== undefined}
  <SearchField
    class="mb-4"
    bind:value={search}
  />
{/if}
{#if page !== undefined}
  <PaginationFancyButton
    bind:max
    bind:value={page}
    bind:limit
  />
{/if}
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
    options={orderOptions ? orderOptions : [
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
