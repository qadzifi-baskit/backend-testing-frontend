<script lang="ts" generics="VT, LT">
  import { cn } from '@/lib/helper/tailwind';
  import SearchField from './SearchField.svelte';
  import type { Snippet } from 'svelte';
  import type { DropdownReturnType } from '@/types/component';
  // eslint-disable-next-line no-undef
  type ValueType = VT;
  // eslint-disable-next-line no-undef
  type LabelType = LT;

  type Display = 'VALUE'|'LABEL';

  type ReturnType = DropdownReturnType<ValueType>;

  type Props = {
    class?: string,
    options?: [ValueType, LabelType][],
    placeholder?: string|Snippet,
    search?: string,
    selectValue?: ValueType,
    display?: Display,
    showValue?: boolean,
    onclick?: () => void,
    onselect?: (value: ValueType) => ReturnType|Promise<ReturnType>,
    dropdownContainer?: Snippet<[Snippet]>,
  };
  let {
    class: clazz = '',
    options = [],
    placeholder = 'placeholder',
    search = $bindable(),
    selectValue = $bindable(),
    display = 'VALUE',
    showValue,
    onclick,
    onselect,
    dropdownContainer,
  }:Props = $props();

  let selectElement:HTMLDetailsElement|undefined;
  const onSelect = () => {
    if (selectElement) {
      selectElement.open = false;
    }
  };
  $effect(() => {
    if (selectValue && onselect) {
      (async () => {
        const result = await onselect(selectValue);
        if (result === undefined) return;
        if ('selectValue' in result) {
          selectValue = result.selectValue;
        }
        if ('search' in result) {
          search = result.search;
        }
      })();
    }
  });
</script>

{#snippet dropdownContent()}
  {#if search !== undefined}
    <SearchField
      bind:value={search}
      class="m-0 rounded-b-none"
    />
  {/if}
  {#each options as [value, label]}
    <button
      class={
        cn(
          'btn form-control block box-border rounded-none',
          'first:rounded-t-[inherit] last:rounded-b-[inherit]',
          'active:hover:animate-none active:hover:transform-none',
          'active:focus:animate-none active:focus:transform-none',
          'has-[:checked]:bg-slate-700',
          'p-0',
        )
      }
      onclick={onSelect}
    >
      <label class="label cursor-pointer py-0 px-4 w-full h-full">
        <span class="label-text">{label}</span>
        <input
          bind:group={selectValue}
          type="radio"
          name="radio-10"
          hidden
          checked
          {value}
        />
      </label>
    </button>
  {/each}
{/snippet}

<details class={cn('dropdown w-full max-w-xs mb-4', clazz)}
  bind:this={selectElement}
>
  <summary class="btn input-bordered w-fit justify-start"
    {onclick}
    title={showValue && selectValue ? `${selectValue}` : undefined}
  >
    {#if selectValue}
      {#if display === 'VALUE'}
        {selectValue}
      {:else}
        {options.find(([value]) => value === selectValue)?.[1]}
      {/if}
    {:else}
      {#if typeof placeholder === 'string'}
        {placeholder}
      {:else}
        {@render placeholder()}
      {/if}
    {/if}
  </summary>
  {#if dropdownContainer}
    {@render dropdownContainer(dropdownContent)}
  {:else}
    <ul class="menu input-bordered border dropdown-content bg-base-100 rounded-box z-[1000] w-fit p-0 shadow">
      {@render dropdownContent()}
    </ul>
  {/if}
</details>
