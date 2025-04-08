<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLInputTypeAttribute } from 'svelte/elements';

  // eslint-disable-next-line no-undef
  type ValueType = T;

  type Props = {
    type?: HTMLInputTypeAttribute|null,
    min?: string|number|null,
    max?: string|number|null,
    readonly?: boolean,
    value?: ValueType,
    class?: string,
    placeholder?: string|null,
    label?: string|Snippet,
    input?: Snippet,
  };
  let {
    type: inputType,
    min,
    max,
    readonly,
    value = $bindable(),
    class: clazz = '',
    placeholder,
    label = '',
    input,
  }: Props = $props();
</script>

<label class={cn('w-full max-w-xs mb-2', clazz)}>
  {#if typeof label === 'string'}
    <span class="fieldset-label mb-2">{label}</span>
  {:else}
    {@render label()}
  {/if}
  {#if input}
    {@render input()}
  {:else}
    <input {readonly} type={inputType} {min} {max} {placeholder} bind:value class="input input-bordered mb-2 w-full max-w-xs" />
  {/if}
</label>
