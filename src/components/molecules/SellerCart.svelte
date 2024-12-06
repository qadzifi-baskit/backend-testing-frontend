<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';

  type Props = {
    client: AxiosInstance,
    userId?: string,
  };
  let {
    client,
    userId = $bindable(),
  }: Props = $props();

  $inspect({ client, userId });
</script>

<Collapse5
  title="Seller Cart"
>
</Collapse5>
