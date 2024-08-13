<script lang="ts">
  import type { CompanyType } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Select from '../Select.svelte';

  export let client:AxiosInstance;
  export let onUserCreated:undefined|(() => void) = undefined;
  export let companyId:string | null = null;
  let companyTypeList:CompanyType[] = [];
  let customerTypeId = '';
  let firstName = '';
  let lastName = '';
  let phone = '';

  client.get('/company/type').then((response) => {
    if (response.status === 200) {
      companyTypeList = response.data?.data ?? [];
      customerTypeId = companyTypeList?.[0]?.id ?? '';
    }
  });

  const onCreateUser = async () => {
    const response = await client.post('/user-offline', {
      firstName,
      lastName,
      phone,
      customerTypeId,
      companyId,
    });
    if (response.status === 200) {
      onUserCreated?.();
    }
  };
</script>

<div class="flex flex-col items-start w-full h-full">
  <input type="text" bind:value={firstName} class="input input-bordered" placeholder="first name">
  <div>&nbsp;</div>
  <input type="text" bind:value={lastName} class="input input-bordered" placeholder="last name">
  <div>&nbsp;</div>
  <input type="text" bind:value={phone} class="input input-bordered" placeholder="phone">
  <Select
    showValue
    options={companyTypeList.map((value) => [value.id, value.name])}
    bind:value={customerTypeId}
  />
  <div class="divider"></div>
  <button
    class="btn bg-slate-600"
    on:click={onCreateUser}
  >
    Create
  </button>
</div>
