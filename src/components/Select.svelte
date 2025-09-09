<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type ValueType = T;

  type Props = {
    showvalue?: boolean;
    options: [ValueType, string, boolean?][],
    value?: ValueType;
    class?: string,
    label?: string|Snippet,
  };

  let {
    showvalue = false,
    options = [],
    value = $bindable(),
    label,
    class: clazz = '',
  }:Props = $props();
</script>

{#if typeof label === 'string'}
  <div class="label">
    <span class="label-text-alt">{label}</span>
  </div>
{:else}
  {@render label?.()}
{/if}
<select bind:value class={cn('select select-bordered', clazz)}>
  {#each options as [optionValue, optionLabel, disabled]}
    <option value={optionValue} {disabled}>{optionLabel}</option>
  {/each}
</select>
{#if showvalue}
  <span class="label">{value}</span>
{/if}
