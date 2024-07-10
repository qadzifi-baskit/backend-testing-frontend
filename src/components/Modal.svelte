<script lang="ts">
  import type { EventHandler } from 'svelte/elements';
  import { cn } from '@/lib/helper/tailwind';

  export let onClose:EventHandler<Event, HTMLDialogElement> = () => undefined;
  export let dialog:HTMLDialogElement;
  let clazz = '';
  export { clazz as class };
</script>

<dialog bind:this={dialog}
  class={cn(
    'p-4 z-50 fixed h-full w-full bg-slate-800 bg-opacity-85 rounded-xl',
    clazz,
  )}
  on:close={onClose}
>
  <slot/>
</dialog>
