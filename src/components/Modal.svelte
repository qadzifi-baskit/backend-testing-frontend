<script lang="ts">
  import type { EventHandler } from 'svelte/elements';
  import { cn } from '@/lib/helper/tailwind';
  import type { Snippet } from 'svelte';

  type Props = {
    dialog?: HTMLDialogElement,
    class?: string,
    onclose?: EventHandler<Event, HTMLDialogElement>,
    children?: Snippet,
  };
  let {
    dialog = $bindable(),
    class: clazz = '',
    onclose = () => undefined,
    children,
  }: Props = $props();
</script>

<dialog bind:this={dialog}
  class={cn(
    'p-4 z-50 fixed h-full w-full bg-slate-800 bg-opacity-85 rounded-xl',
    clazz,
  )}
  {onclose}
>
  {@render children?.()}
</dialog>
