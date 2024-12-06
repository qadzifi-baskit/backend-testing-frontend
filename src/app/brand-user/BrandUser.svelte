<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BrandManagement from '@/components/molecules/BrandManagement.svelte';
  import CompanyBrandBranchManagement from '@/components/molecules/CompanyBrandBranchManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import RegisterBrand from '@/components/molecules/RegisterBrand.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { BrandUserStore } from '@/store/store';
  import type { Company } from '@/types';
  import axios from 'axios';

  type Props = {
    host?: string,
    showHost?: boolean,
  };

  let {
    host = $bindable(import.meta.env.VITE_API_HOST),
    showHost = true,
  }:Props = $props();

  const client = axios.create({ baseURL: host });
  let username = $state('');
  let password = $state('');
  let userCompanyId = $state('');

  async function getMyCompany() {
    if (!$BrandUserStore.loggedIn) return;
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

<div id="root" class="p-6 bg-[#27303b]">
  <Config
    bind:host
    {showHost}
    {client}
  />
  <div class="divider"></div>
  <RegisterBrand
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={BrandUserStore}
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
    {client}
  />
</div>
