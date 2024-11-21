<script lang="ts">
  import Collapse5 from '../Collapse5.svelte';

  type Props = {
    client: AxiosInstance,
    userId?: string,
  };
  let {
    client,
    userId = $bindable(),
  }: Props = $props();
</script>

<Collapse5
  title="Seller Cart"
>
</Collapse5>
