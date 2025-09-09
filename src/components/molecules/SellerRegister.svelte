<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import Collapse5 from '../Collapse5.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import IconButton from '../atoms/IconButton.svelte';
  import { AiOutlineReload } from 'svelte-icons-pack/ai';

  type Props = {
    showEmail?: boolean,
    helpGenerateEmail?: boolean,
  };
  let {
    showEmail = $bindable(false),
    helpGenerateEmail = false,
  }:Props = $props();

  const payload = $state({
    firstName: '',
    lastName: '',
    phone: <string|undefined>undefined,
    email: <string|undefined>undefined,
    password: '',
    companyName: '',
    subscriptionType: 'ENTERPRISE',
    companyTypeId: <string|undefined>undefined,
    roleName: <string|undefined>undefined,
  });
  let showDetail = $state(false);

  function generateEmail() {
    payload.email = `${payload.firstName.replace(/\s+/g, '-').toLowerCase()}.` +
      `${payload.lastName.replace(/\s+/g, '-').toLowerCase()}@yopmail.com`;
  }

  const debounceGenerateEmail = debounce(generateEmail);

  $effect(() => {
    if (helpGenerateEmail && payload.firstName !== '' && payload.lastName !== '') {
      debounceGenerateEmail();
    }
  });

  $effect(() => {
    if (payload.phone?.startsWith('0')) {
      payload.phone = payload.phone.replace(/^0+/, '+62');
    }
  });

  const SubscriptionTypeOptions:[string, string][] = [
    ['ENTERPRISE', 'Enterprise'],
    ['FREE_TRIAL', 'Free Trial'],
  ];

  function prehook(data: typeof payload) {
    if (!data.phone && !data.email) {
      stringToast('Please provide either phone or email.');
      return;
    }
    if (!data.phone) {
      data.phone = undefined;
    }
    if (!data.email) {
      data.email = undefined;
    }
    if (!payload.companyTypeId) {
      data.companyTypeId = undefined;
    }
    if (!payload.roleName) {
      data.roleName = undefined;
    }
    return data;
  }
</script>

{#snippet content()}
  <div class="collapse-content">
    <FormWrapper
      noauth
      {payload}
      {prehook}
      path="/auth/register"
    >
      <FormInput label="First Name" placeholder="first name" bind:value={payload.firstName}/>
      <FormInput label="Last Name" placeholder="last name" bind:value={payload.lastName}/>
      <FormInput label="Phone" placeholder="phone" bind:value={payload.phone}/>
      <FormInput label="Show E-Mail" type="checkbox" bind:checked={showEmail}/>
      {#if showEmail}
        <FormInput class="inline-flex" label="E-Mail" placeholder="email" type="email" bind:value={payload.email}/>
        <IconButton class="mb-2" type="button" icon={AiOutlineReload} onclick={generateEmail}/>
      {/if}
      <FormInput label="Password" type="password" placeholder="password" bind:value={payload.password} toggle/>
      <FormInput label="Company Name" placeholder="company name" bind:value={payload.companyName}/>
      <span class="fieldset-label">Subscription Type</span>
      <DropdownSelect
        options={SubscriptionTypeOptions}
        placeholder="subscription type"
        bind:value={payload.subscriptionType}
      />
      <div class="fieldset-label my-2"></div>
      <FormInput label="Details" type="checkbox" bind:checked={showDetail}/>
      {#if showDetail}
        <FormInput label="Company Type ID" placeholder="company type id" bind:value={payload.companyTypeId}/>
        <FormInput label="Company Type ID" placeholder="company type id" bind:value={payload.roleName}/>
      {/if}
      <SubmitButton/>
    </FormWrapper>
  </div>
{/snippet}

<Collapse5 title="Register Seller"
  class="overflow-visible"
  {content}
/>
