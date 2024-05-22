<script lang=ts>
  import { cn } from "@/lib/helper/tailwind";
  import type { MouseEventHandler } from "svelte/elements";
  let clazz = '';
  export { clazz as class };

  export let title:string;
  export let show = false;
  export let onClick:MouseEventHandler<HTMLInputElement> = () => {};
</script>

<div class={cn("collapse bg-base-200", clazz)}>
  <input on:click={onClick} type="checkbox" bind:checked={show} />
  <div class="collapse-title text-xl font-medium">{title}</div>
  <div class="collapse-content">
    <slot/>
  </div>
</div>