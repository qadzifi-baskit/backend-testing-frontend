<script lang="ts">
  import AclList from '@/components/molecules/ACLList.svelte';
  import ApiList from '@/components/molecules/APIList.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import RoleManagement from '@/components/molecules/RoleManagement.svelte';
  import TranslationManagement from '@/components/molecules/TranslationManagement.svelte';
  import UserManagement from '@/components/molecules/UserManagement.svelte';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { SuperAdminStore } from '@/store/store';
  import type { AppConfig } from '@/types/app';

  type Props = {
    host?: string,
    config?: AppConfig,
  };
  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    config = 'host',
  }: Props = $props();

  const client = createAxiosInstance({ baseURL: host });

  Context.set('client', client);

  let clientType = $state('WEB_CMS');
  let username = $state('super.admin@testing.com');
  let password = $state('12345678');
</script>

<div id="root" class="p-6">
  <Config
    bind:host
    bind:clientType
    show={config}
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={SuperAdminStore}
    {client}
    bind:username
    bind:password
  />
  {#if $SuperAdminStore.loggedIn}
    <div class="divider"></div>
    <ApiList
      {client}
    />
    <div class="divider"></div>
    <AclList/>
    <div class="divider"></div>
    <RoleManagement/>
    <div class="divider"></div>
    <UserManagement
      {client}
    />
    <div class="divider"></div>
    <TranslationManagement
      {client}
    />
  {/if}
</div>
