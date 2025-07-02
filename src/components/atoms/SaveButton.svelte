<script lang="ts">
  import type { IconButtonProps } from '@/types/component';
  import { FaSolidFloppyDisk } from 'svelte-icons-pack/fa';
  import IconButton from './IconButton.svelte';

  let props: Omit<IconButtonProps, 'icon'> = $props();
</script>

<IconButton {...props} icon={FaSolidFloppyDisk}/>
