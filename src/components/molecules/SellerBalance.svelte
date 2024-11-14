<script lang="ts">
  import { SellerAdminStore } from '@/store/store';
  import Collapse5 from '../Collapse5.svelte';
  import type { AxiosInstance } from 'axios';
  import { listenAuthSuccess } from '@/event';

  type Props = {
    client: AxiosInstance,
  };

  let {
    client,
  }:Props = $props();

  let balance = $state(0);
  let pendingBalance = $state(0);
  let companyId = $state('4439a3df-cfe0-441a-9776-d869bd6b6a89');
  let userId = $state('');

  const onGetBalance = async () => {
    if (!$SellerAdminStore.loggedIn) return;
    const response = await client.get(`/wallet/${userId}`);
    if (response.status === 200) {
      balance = response.data.data.balance;
    }
  };

  const onGetPendingBalance = async () => {
    if (!$SellerAdminStore.loggedIn) return;
    const response = await client.get(`/company/wallet/${companyId}`);
    if (response.status === 200) {
      pendingBalance = response.data.data.pendingBalance;
    }
  };

  listenAuthSuccess(() => {
    onGetBalance();
    onGetPendingBalance();
  });
</script>

<Collapse5 title="Profile">
  <input type="text" bind:value={companyId}
    placeholder="company id"
    class="input input-bordered w-full max-w-xs"
  />
  <div>
    <button class="btn" onclick={onGetBalance}>Get Balance</button>
    <span>Balance: {balance}</span>
  </div>
  <div>
    <button class="btn" onclick={onGetBalance}>Get Pending Balance</button>
    <span>Pending Balance: {pendingBalance}</span>
  </div>
</Collapse5>
