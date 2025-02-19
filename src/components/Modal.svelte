<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import { currentModalStore } from '@/store/store';
  import type { Snippet } from 'svelte';
  import type { EventHandler } from 'svelte/elements';

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

  function ontoggle() {
    if (dialog?.open) {
      const pushedDialog = dialog;
      currentModalStore.update((value) => [pushedDialog, ...value]);
    } else {
      currentModalStore.update((value) => value.slice(1));
    }
  }
</script>

<dialog bind:this={dialog}
  class={cn(
    'p-4 z-50 fixed h-full w-full bg-slate-800 bg-opacity-85 rounded-xl',
    clazz,
  )}
  {onclose}
  {ontoggle}
>
  {@render children?.()}
</dialog>
