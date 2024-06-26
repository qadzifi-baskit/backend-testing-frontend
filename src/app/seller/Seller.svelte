<script lang="ts">
  import Collapse from "@/components/Collapse.svelte";
  import Auth from "@/components/molecules/Auth.svelte";
  import Config from "@/components/molecules/Config.svelte";
  import axios from "axios";
  import { writable } from "svelte/store";

  const client = axios.create();
  let host = 'https://api-beta.baskit.app/v2';
  let clientType = 'BASKIT_SHOP';
  let username = 'nagamas@testing.com';
  let password = '12345678';
  let balance = 0;
  let pendingBalance = 0;
  let companyId = '4439a3df-cfe0-441a-9776-d869bd6b6a89';

  const userId = writable('');

  const onGetBalance = async () => {
    const response = await client.get(`${host}/wallet/${$userId}`);
    if (response.status === 200) {
      balance = response.data.data.balance;
    }
  };

  const onGetPendingBalance = async () => {
    const response = await client.get(`${host}/company/wallet/${companyId}`);
    if (response.status === 200) {
      pendingBalance = response.data.data.pendingBalance;
    }
  };

  const onAuth = async () => {
    const response = await client.post(`${host}/auth`, {
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

<div class="p-6">
  <Config
    bind:host
    bind:clientType
  />
  <Auth
    bind:username
    bind:password
    onAuth={onAuth}
  />
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
</div>
