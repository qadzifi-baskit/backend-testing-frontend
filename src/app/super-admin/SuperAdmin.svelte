<script lang="ts">
  import AclList from '@/components/molecules/ACLList.svelte';
  import ApiList from '@/components/molecules/APIList.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import axios from 'axios';

  export let host = 'https://api-beta.baskit.app/v2';

  const client = axios.create({ baseURL: host });

  let clientType = 'WEB_CMS';
  let username = 'super.admin@testing.com';
  let password = '12345678';
</script>

<div id="root" class="p-6 bg-[#27303b]">
  <Config
    bind:host
    bind:clientType
    showHost={false}
  />
  <div class="divider"></div>
  <Auth
    {client}
    bind:username
    bind:password
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
