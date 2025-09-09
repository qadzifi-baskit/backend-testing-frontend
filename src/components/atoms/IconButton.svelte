<script lang="ts">
  import { cn } from '@/lib/helper/tailwind';
  import type { IconButtonProps } from '@/types/component';
  import { Icon } from 'svelte-icons-pack';

  let {
    icon,
    onclick,
    class: clazz,
    ...rest
  }: IconButtonProps = $props();
</script>

<button class={cn('btn btn-secondary', clazz)}
  {...rest}
  {onclick}
>
  <Icon src={icon}/>
</button>
