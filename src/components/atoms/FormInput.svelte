<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLInputTypeAttribute } from 'svelte/elements';

  // eslint-disable-next-line no-undef
  type ValueType = T;

  type Props = {
    type?: HTMLInputTypeAttribute|null,
    pattern?: string|null,
    min?: number|null,
    max?: number|null,
    readonly?: boolean,
    value?: ValueType,
    class?: string,
    placeholder?: string|null,
    label?: string|Snippet,
    error?: string|Snippet,
    input?: Snippet,
    disabled?: boolean,
    required?: boolean,
  };
  let {
    type: inputType,
    pattern,
    min,
    max,
    readonly,
    value = $bindable(),
    class: clazz = '',
    placeholder,
    label = '',
    error = '',
    input,
    disabled = $bindable(false),
    required = $bindable(false),
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
    <input
      {disabled}
      {required}
      {readonly}
      type={inputType}
      minlength={min}
      maxlength={max}
      {placeholder}
      bind:value
      {pattern}
      class={cn(
        'input input-bordered flex mb-2 w-full max-w-xs',
        {
          'validator': Boolean(error),
        },
      )}
    />
  {/if}
  {#if typeof error === 'string'}
    <p class="validator-hint">{error}</p>
  {:else}
    {@render error()}
  {/if}
</label>
