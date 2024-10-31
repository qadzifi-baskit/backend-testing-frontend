<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BrandManagement from '@/components/molecules/BrandManagement.svelte';
  import RegisterBrand from '@/components/molecules/RegisterBrand.svelte';
  import { BrandUserStore } from '@/store/store';
  import axios from 'axios';

  type Props = {
    host: string,
  };

  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
  }:Props = $props();

  const client = axios.create({ baseURL: host });
  let username = $state('');
  let password = $state('');
</script>

<div id="root" class="p-6 bg-[#27303b]">
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
    {client}
  />
</div>
