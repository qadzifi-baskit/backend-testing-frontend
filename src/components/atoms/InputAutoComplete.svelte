<script lang="ts">
  import { searchStrings } from '@/lib/helper/util';

  type Props = {
    maxlength?: number,
    value?: string,
    placeholder?: string,
    suggestions?: string[],
  };
  let {
    maxlength,
    value = $bindable(''),
    placeholder = '',
    suggestions = [],
  }: Props = $props();

  let searchValue = $state('');
  let inputElement:HTMLInputElement|undefined = $state();
  let filtered = $derived.by(() => {
    if (searchValue === '') {
      return suggestions;
    }
    return searchStrings(suggestions, searchValue);
  });

  $effect(() => {
    if (
      value !== undefined &&
      inputElement &&
      document.activeElement === inputElement
    ) {
      searchValue = value;
    }
  });
</script>

<div class="dropdown">
  <input bind:value type="text" {placeholder} class="input input-bordered w-full max-w-xs"
    {maxlength}
    bind:this={inputElement}
  >
  <ul class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    {#each filtered as item, idx}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <li
        tabindex={idx + 1}
        onfocusin={() => value = item}
        class="!pointer-events-auto"
      >
        <button
          onclick={() => {
            searchValue = item;
            (document.activeElement as HTMLElement).blur();
          }}
        >{item}</button>
      </li>
    {/each}
  </ul>
</div>
