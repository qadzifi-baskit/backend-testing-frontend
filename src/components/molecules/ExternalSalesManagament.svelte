<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import FieldTeamManagement from './FieldTeamManagement.svelte';
  import { SellerAdminStore } from '@/store/store';

  type Props = {
    client: AxiosInstance,
    companyId: string,
  };
  let {
    client,
    companyId = $bindable(''),
  }: Props = $props();
</script>

<FieldTeamManagement
  {client}
  role="EXTERNAL_SALESMAN"
  bind:companyId
  store={SellerAdminStore}
  title="External Sales Management"
/>
