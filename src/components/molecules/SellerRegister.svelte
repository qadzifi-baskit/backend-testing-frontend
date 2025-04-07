<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';

  type Props = {
    client: AxiosInstance,
    showEmail?: boolean,
    helpGenerateEmail?: boolean,
  };
  let {
    client,
    showEmail = false,
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
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">First Name</span>
        </div>
        <input type="text" placeholder="first name" bind:value={payload.firstName} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Last Name</span>
        </div>
        <input type="text" placeholder="last name" bind:value={payload.lastName} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Phone</span>
        </div>
        <input type="text" placeholder="phone" bind:value={payload.phone} class="input input-bordered w-full max-w-xs" />
      </label>
      {#if showEmail}
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">E-Mail</span>
          </div>
          <input type="text" placeholder="email" bind:value={payload.email} class="input input-bordered w-full max-w-xs" />
        </label>
      {/if}
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Company Name</span>
        </div>
        <input type="text" placeholder="company name" bind:value={payload.companyName} class="input input-bordered w-full max-w-xs" />
      </label>
      <DropdownSelect
        class="my-4"
        options={SubscriptionTypeOptions}
        placeholder="subscription type"
        bind:value={payload.subscriptionType}
      />
      <div>
        <button class="btn bg-slate-600" type="submit">Register</button>
      </div>
    </FormWrapper>
  </div>
{/snippet}

<Collapse5 title="Register Seller"
  class="overflow-visible"
  {content}
/>
