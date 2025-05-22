<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import FieldTeamManagement from '@/components/molecules/FieldTeamManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { createAuthStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { AppConfig } from '@/types/app';
  import type { UserContext } from '@/types/context';
  import { writable } from 'svelte/store';

  type Props = {
    host?: string,
    config: AppConfig,
  };
  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    config = 'host',
  }: Props = $props();

  const client = createAxiosInstance({ baseURL: host });
  const store = createAuthStore();
  const userContext = writable<UserContext>({});
  Context.set('auth', store);
  Context.set('user', userContext);

  let clientType = $state('WEB_CMS');
  let username = $state('supercompany.turbine439@passinbox.com');
  let password = $state('Samagan!23');
  let companyId = $state('');

  async function getMyCompany() {
    if (!$store.loggedIn) return;
    userContext.set({
      id: $store.userId,
    });
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  $effect(() => {
    listenDoAuth(() => {
      companyId = '';
    });
    listenAuthSuccess(() => {
      getMyCompany();
    });
  });

  $inspect({ companyId });
</script>

<div id="root" class="p-6">
  <Config
    bind:host
    bind:clientType
    show={config}
    {client}
  />
  <div class="divider"></div>
  <SellerRegister {client}/>
  <div class="divider"></div>
  <Auth {store} {client}
    bind:username
    bind:password
  />
  {#if $store.loggedIn}
    <div class="divider"></div>
    <FieldTeamManagement
      {client}
      role={[
        'BSC_SUPER_ADMIN',
        'BSC_ADMIN',
        'BSC_ACCOUNT_MANAGER',
        'BSC_PURCHASING',
        'BSC_FINANCE',
        'BSC_OFFICER',
      ]}
      {companyId}
      {store}
    />
  {/if}
</div>
