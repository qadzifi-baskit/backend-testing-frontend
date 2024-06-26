<script lang="ts" generics="T">
  import { cn } from '@/lib/helper/tailwind';
  // eslint-disable-next-line no-undef
  type ValueType = T;

  export let title = '';
  export let showValue = false;
  export let options: [ValueType, string][] = [];
  export let value:ValueType;
  let clazz = '';
  export { clazz as class };
</script>

<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">{title}</span>
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
