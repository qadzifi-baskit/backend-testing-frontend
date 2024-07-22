<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  // eslint-disable-next-line no-undef
  type ValueType = T;

  export let title = '';
  export let showValue = false;
  export let options: [ValueType, string][] = [];
  export let value:ValueType;
  export let containerClass = '';
  export let labelClass = '';
  let clazz = '';
  export { clazz as class };
</script>

<label class={cn('form-control w-full max-w-xs', containerClass)}>
  <div class="label">
    <span class={cn('label-text', labelClass)}>{title}</span>
  </div>
  <select bind:value class={cn('select select-bordered', clazz)}>
    {#each options as [optionValue, optionLabel]}
      <option value={optionValue}>{optionLabel}</option>
    {/each}
  </select>
  {#if showValue}
    <div class="label">
      <span class="label-text-alt">{value}</span>
    </div>
  {/if}
</label>
