<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    title: string,
    class?: string,
    show?: boolean,
    onClick?: MouseEventHandler<HTMLInputElement>,
    content?: Snippet,
    children?: Snippet,
  };
  let {
    class: clazz = '',
    title,
    show = $bindable(false),
    onClick = () => undefined,
    content,
    children,
  }:Props = $props();
</script>

<div class={cn('collapse bg-base-200', clazz)}>
  <input onclick={onClick} type="checkbox" bind:checked={show} />
  <div class="collapse-title text-xl font-medium">{title}</div>
  {#if content}
    {@render content()}
  {:else if children}
    <div class="collapse-content overflow-x-auto">
      {@render children()}
    </div>
  {/if}
</div>
