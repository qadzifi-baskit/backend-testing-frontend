<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';
  type Props = {
    class?: string,
    title?: string,
    show?: boolean,
    onclick?: MouseEventHandler<HTMLInputElement>,
    children?: Snippet,
    content?: Snippet<[Snippet?]>,
  };
  let {
    class: clazz = '',
    title = '',
    show = $bindable(),
    onclick,
    children,
    content,
  }: Props = $props();
</script>

<div class={cn('collapse bg-base-200', clazz)}>
  <input {onclick} type="checkbox" bind:checked={show} />
  <div class="collapse-title text-xl font-medium">{title}</div>
  {#if content}
    {@render content(children)}
  {:else}
    <div class="collapse-content overflow-x-auto">
      {@render children?.()}
    </div>
  {/if}
</div>
