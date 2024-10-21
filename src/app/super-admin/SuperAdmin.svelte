<script lang="ts">
  import AclList from '@/components/molecules/ACLList.svelte';
  import ApiList from '@/components/molecules/APIList.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import axios from 'axios';

  export let host = 'https://api-beta.baskit.app/v2';

  const client = axios.create({ baseURL: host });

  let clientType = 'WEB_CMS';
  let username = 'boa@baskit.app';
  let password = '12345678';

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
  <ApiList
    {client}
  />
  <div class="divider"></div>
  <AclList
    {client}
  />
</div>
