<script lang="ts">
  import type { IconButtonProps } from '@/types/component';
  import { Icon } from 'svelte-icons-pack';

  let { icon, onclick }: IconButtonProps = $props();
</script>

<button class="btn btn-secondary"
  {onclick}
>
  <Icon src={icon}/>
</button>
