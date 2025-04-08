<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidTrash } from 'svelte-icons-pack/fa';

  type Props = {
    onclick?: (e: MouseEvent) => void;
  };
  let { onclick }: Props = $props();
</script>

<button class="btn btn-secondary"
  {onclick}
>
  <Icon src={FaSolidTrash}/>
</button>
