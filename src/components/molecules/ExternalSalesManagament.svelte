<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import FieldTeamManagement from './FieldTeamManagement.svelte';
  import { SellerAdminStore } from '@/store/store';

  type Props = {
    client: AxiosInstance,
    companyId: string,
    show?: boolean,
  };
  let {
    client,
    companyId = $bindable(''),
    show = $bindable(false),
  }: Props = $props();
</script>

<FieldTeamManagement
  {client}
  bind:show
  role="EXTERNAL_SALESMAN"
  bind:companyId
  store={SellerAdminStore}
  title="External Sales Management"
/>
