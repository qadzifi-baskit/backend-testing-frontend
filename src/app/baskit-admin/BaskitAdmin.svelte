<script lang="ts"> import DatePicker from '@/components/DatePicker.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import axios from 'axios';
  import { writable } from 'svelte/store';

  export let host = 'https://api-beta.baskit.app/v2';
  const userId = writable('');
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
      userId.set(response.data?.data?.id);
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
    }
  };
</script>

<div id="root" class="p-6 bg-[#27303b]">
  <DatePicker/>
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
</div>
