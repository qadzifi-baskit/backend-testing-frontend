<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    title: string|Snippet,
    class?: string,
    show?: boolean,
    alwaysshow?: boolean,
    onClick?: MouseEventHandler<HTMLInputElement>,
    content?: Snippet,
    children?: Snippet,
  };
  let {
    class: clazz = '',
    title = '',
    show = $bindable(false),
    alwaysshow = false,
    onClick = () => undefined,
    content,
    children,
  }:Props = $props();

  export function open() {
    show = true;
  }
</script>

<div class={cn('collapse bg-base-200', clazz)}>
  {#if alwaysshow}
    <input disabled onclick={onClick} type="checkbox" checked />
  {:else}
    <input onclick={onClick} type="checkbox" bind:checked={show} />
  {/if}
  {#if typeof title === 'string'}
    <div class="collapse-title text-xl font-medium">{title}</div>
  {:else}
    {@render title()}
  {/if}
  {#if content}
    {@render content()}
  {:else if children}
    <div class="collapse-content overflow-x-auto">
      {@render children()}
    </div>
  {/if}
</div>
