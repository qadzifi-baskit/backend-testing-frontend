<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';

  type Props = {
    children?: string|Snippet,
    class?: string,
  };
  let {
    children,
    class: clazz = '',
  }: Props = $props();
</script>

<div class={cn('sticky z-10 h-0 float-right top-0', clazz)}>
  <div class="badge badge-primary">
    {#if typeof children === 'string'}
      {children}
    {:else}
      {@render children?.()}
    {/if}
  </div>
</div>
