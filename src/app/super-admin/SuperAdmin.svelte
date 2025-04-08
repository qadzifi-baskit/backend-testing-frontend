<script lang="ts">
  import AclList from '@/components/molecules/ACLList.svelte';
  import ApiList from '@/components/molecules/APIList.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import RoleManagement from '@/components/molecules/RoleManagement.svelte';
  import TranslationManagement from '@/components/molecules/TranslationManagement.svelte';
  import UserManagement from '@/components/molecules/UserManagement.svelte';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { SuperAdminStore } from '@/store/store';

  type Props = {
    host?: string,
    showHost?: boolean,
  };
  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    showHost = true,
  }: Props = $props();

  const client = createAxiosInstance({ baseURL: host });

  let clientType = $state('WEB_CMS');
  let username = $state('super.admin@testing.com');
  let password = $state('12345678');
</script>

<div id="root" class="p-6">
  <Config
    bind:host
    bind:clientType
    {showHost}
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={SuperAdminStore}
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
  <div class="divider"></div>
  <RoleManagement
    {client}
  />
  <div class="divider"></div>
  <UserManagement
    {client}
  />
  <div class="divider"></div>
  <TranslationManagement
    {client}
  />
</div>
