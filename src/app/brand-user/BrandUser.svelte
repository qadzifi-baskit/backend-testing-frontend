<script lang="ts">
  import RegisterBrand from '@/components/molecules/RegisterBrand.svelte';
  import axios from 'axios';

  type Props = {
    host: string,
  };

  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
  }:Props = $props();

  const client = axios.create({ baseURL: host });
</script>

<div id="root" class="p-6 bg-[#27303b]">
  <RegisterBrand
    {client}
  />
</div>
