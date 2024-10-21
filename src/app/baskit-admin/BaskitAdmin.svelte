<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import axios from 'axios';
  import Inventory from '../seller/inventory/Inventory.svelte';
  import SellerList from '@/components/molecules/SellerList.svelte';

  export let host = 'https://api-beta.baskit.app/v2';
  let clientType = 'WEB_CMS';
  let username = 'boa@baskit.app';
  let password = '12345678';
  const client = axios.create({ baseURL: host });

  $: {
    client.defaults.baseURL = host;
  }

  const onAuth = async () => {
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
    }
  };
</script>

<div id="root" class="p-6 bg-[#27303b]">
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
  <OrderList {client}/>
  <div class="divider"></div>
  <ProductManagement {client}/>
  <div class="divider"></div>
  <Inventory {client}/>
  <div class="divider"></div>
  <SellerList {client}/>
</div>
