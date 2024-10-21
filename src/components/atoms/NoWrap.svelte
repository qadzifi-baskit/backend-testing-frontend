<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';

  let clazz = '';
  export { clazz as class };
</script>

<span class={cn('whitespace-nowrap', clazz)}>
  <slot/>
</span>
