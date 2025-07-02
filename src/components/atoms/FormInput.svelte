<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { AiOutlineEye, AiOutlineEyeInvisible } from 'svelte-icons-pack/ai';
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
    checked?: boolean,
    toggle?: boolean,
    show?: boolean,
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
    checked = $bindable(),
    toggle = false,
    show = $bindable(false),
  }: Props = $props();

  const isError = Boolean(error);
  const isCheckbox = inputType === 'checkbox';
</script>

{#if inputType !== 'checkbox'}
  {#if typeof label === 'string'}
    <span class="fieldset-label mb-2">{label}</span>
  {:else}
    {@render label()}
  {/if}
{/if}
<label class={cn(
  'mb-2',
  !error && 'flex',
  inputType !== 'checkbox' && 'p-0 gap-0 w-full max-w-xs',
  !isCheckbox && !isError && 'input',
  clazz,
)}>
  {#if input}
    {@render input()}
  {:else}
    {#if inputType === 'checkbox'}
      <input
        {disabled}
        {required}
        {readonly}
        type="checkbox"
        bind:checked
        class={cn(
          'checkbox',
          {
            'validator': Boolean(error),
          },
        )}
      />
    {:else}
      <input
        {disabled}
        {required}
        {readonly}
        type={show && inputType === 'password' ? 'text' : inputType}
        minlength={min}
        maxlength={max}
        {placeholder}
        bind:value
        {pattern}
        class={cn(
          'px-4 w-full',
          {
            'validator': isError,
            'input': inputType !== 'password' && isError,
          },
        )}
      />
    {/if}
  {/if}
  {#if typeof error === 'string'}
    {#if error}
      <p class="validator-hint">{error}</p>
    {/if}
  {:else}
    {@render error()}
  {/if}
  {#if toggle}
    <label class="absolute right-2 grid place-items-center hover:cursor-pointer">
      <input type="checkbox" class="checkbox peer invisible" bind:checked={show}/>
      <Icon className="absolute hidden peer-checked:block" src={AiOutlineEye} size="1.5em"/>
      <Icon className="absolute peer-checked:hidden" src={AiOutlineEyeInvisible} size="1.5em"/>
    </label>
  {/if}
  {#if inputType === 'checkbox'}
    {#if typeof label === 'string'}
      <span class="ml-2 fieldset-label">{label}</span>
    {:else}
      {@render label()}
    {/if}
  {/if}
</label>
