<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BrandManagement from '@/components/molecules/BrandManagement.svelte';
  import CompanyBrandBranchManagement from '@/components/molecules/CompanyBrandBranchManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import RegisterBrand from '@/components/molecules/RegisterBrand.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { apiEnv } from '@/lib/config/env.svelte';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { createAuthStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { AppConfig } from '@/types/app';

  type Props = {
    host?: string,
    config?: AppConfig,
  };

  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    config = 'host',
  }:Props = $props();

  const client = createAxiosInstance({ baseURL: host });
  const auth = createAuthStore();

  Context.set('client', client);
  Context.set('auth', auth);

  let username = $state('');
  let password = $state('');
  let userCompanyId = $state('');

  async function getMyCompany() {
    if (!$auth.loggedIn) return;
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    userCompanyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  $effect(() => {
    getMyCompany();
  });

  listenDoAuth(() => {
    userCompanyId = '';
  });
  listenAuthSuccess(getMyCompany);
</script>

<div id="root" class="p-6">
  <Config show={config} {client}/>
  <div class="divider"></div>
  <RegisterBrand
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={auth}
    {client}
    bind:username
    bind:password
  />
  <div class="divider"></div>
  <BrandManagement
    bind:userCompanyId
    {client}
  />
  <div class="divider"></div>
  <CompanyBrandBranchManagement
    bind:userCompanyId
  />
</div>
