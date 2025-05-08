<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
    showEmail?: boolean,
    helpGenerateEmail?: boolean,
  };
  let {
    client,
    showEmail = $bindable(false),
    helpGenerateEmail = false,
  }:Props = $props();

  const payload = $state({
    firstName: '',
    lastName: '',
    phone: '',
    email: <string|undefined>undefined,
    companyName: '',
    subscriptionType: 'ENTERPRISE',
  });

  function generateEmail() {
    payload.email = `${payload.firstName.replace(/\s+/g, '-').toLowerCase()}.` +
      `${payload.lastName.replace(/\s+/g, '-').toLowerCase()}@testing.com`;
  }

  const debounceGenerateEmail = debounce(generateEmail);

  $effect(() => {
    if (helpGenerateEmail && payload.firstName !== '' && payload.lastName !== '') {
      debounceGenerateEmail();
    }
  });

  $effect(() => {
    if (payload.phone.startsWith('0')) {
      payload.phone = payload.phone.replace(/^0+/, '+62');
    }
  });

  const SubscriptionTypeOptions:[string, string][] = [
    ['ENTERPRISE', 'Enterprise'],
    ['FREE_TRIAL', 'Free Trial'],
  ];
</script>

{#snippet content()}
  <div class="collapse-content">
    <FormWrapper
      {client}
      {payload}
      path="/auth/register"
    >
      <FormInput label="First Name" placeholder="first name" bind:value={payload.firstName}/>
      <FormInput label="Last Name" placeholder="last name" bind:value={payload.lastName}/>
      <FormInput label="Phone" placeholder="phone" bind:value={payload.phone}/>
      <label class="label fieldset-label mb-2">
        <input type="checkbox" bind:checked={showEmail} class="checkbox"/>
        Show E-Mail
      </label>
      {#if showEmail}
        <FormInput label="E-Mail" placeholder="email" bind:value={payload.email}/>
      {/if}
      <FormInput label="Company Name" placeholder="company name" bind:value={payload.companyName}/>
      <span class="fieldset-label">Subscription Type</span>
      <DropdownSelect
        options={SubscriptionTypeOptions}
        placeholder="subscription type"
        bind:value={payload.subscriptionType}
      />
      <div class="fieldset-label my-2"></div>
      <SubmitButton/>
    </FormWrapper>
  </div>
{/snippet}

<Collapse5 title="Register Seller"
  class="overflow-visible"
  {content}
/>
