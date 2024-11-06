<script lang="ts" generics="VT, LT">
  import { cn } from '@/lib/helper/tailwind';
  import SearchField from './SearchField.svelte';
  // eslint-disable-next-line no-undef
  type ValueType = VT;
  // eslint-disable-next-line no-undef
  type LabelType = LT;

  type Display = 'VALUE'|'LABEL';

  type Props = {
    class?: string,
    options?: [ValueType, LabelType][],
    placeholder?: string,
    search?: string,
    selectValue?: ValueType,
    display?: Display,
    showValue?: boolean,
  };

  let {
    class: clazz = '',
    options = [],
    placeholder = 'placeholder',
    search = $bindable(),
    selectValue = $bindable(),
    display = 'VALUE',
    showValue,
  }:Props = $props();

  let selectElement:HTMLDetailsElement|undefined;
  const onSelect = () => {
    if (selectElement) {
      selectElement.open = false;
    }
  };
</script>

<details class={cn('dropdown w-full max-w-xs mb-4', clazz)}
  bind:this={selectElement}
>
  <summary class="btn input-bordered w-fit justify-start"
    title={showValue && selectValue ? `${selectValue}` : undefined}
  >
    {#if display === 'VALUE'}
      {selectValue ?? placeholder}
    {:else}
      {options.find(([value]) => value === selectValue)?.[1] ?? placeholder}
    {/if}
  </summary>
  <ul class="menu input-bordered border dropdown-content bg-base-100 rounded-box z-[1000] w-52 p-0 shadow">
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
  </ul>
</details>
