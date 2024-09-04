<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import axios from 'axios';
  import { writable } from 'svelte/store';
  import Inventory from './inventory/Inventory.svelte';

  export let host = 'https://api-beta.baskit.app/v2';
  const client = axios.create({
    baseURL: host,
  });
  let clientType = 'WEB_CMS';
  let username = 'nagamas@testing.com';
  let password = '12345678';
  let balance = 0;
  let pendingBalance = 0;
  let companyId = '4439a3df-cfe0-441a-9776-d869bd6b6a89';

  const userId = writable('');

  $: {
    client.defaults.baseURL = host;
  }

  const onGetBalance = async () => {
    const response = await client.get(`/wallet/${$userId}`);
    if (response.status === 200) {
      balance = response.data.data.balance;
    }
  };

  const onGetPendingBalance = async () => {
    const response = await client.get(`/company/wallet/${companyId}`);
    if (response.status === 200) {
      pendingBalance = response.data.data.pendingBalance;
    }
  };

  const onAuth = async () => {
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      userId.set(response.data?.data?.id);
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      onGetBalance();
      onGetPendingBalance();
    }
  };
</script>

<div class="p-6 bg-[#27303b]">
  <Config
    bind:host
    bind:clientType
    showHost={false}
  />
  <div class="divider"></div>
  <Auth
    bind:username
    bind:password
    onAuth={onAuth}
  />
  <div class="divider"></div>
  <Collapse title="Profile">
    <input type="text" bind:value={companyId}
      placeholder="company id"
      class="input input-bordered w-full max-w-xs"
    />
    <div>
      <button class="btn" on:click={onGetBalance}>Get Balance</button>
      <span>Balance: {balance}</span>
    </div>
    <div>
      <button class="btn" on:click={onGetBalance}>Get Pending Balance</button>
      <span>Pending Balance: {pendingBalance}</span>
    </div>
  </Collapse>
  <div class="divider"></div>
  <Inventory {client}/>
</div>
