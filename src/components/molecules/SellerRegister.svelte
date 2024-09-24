<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import PostButton from '../atoms/PostButton.svelte';
  import Collapse from '../Collapse.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  export let client:AxiosInstance;

  const data = {
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    subscriptionType: 'ENTERPRISE',
  };

  const SubscriptionTypeOptions:[string, string][] = [
    ['ENTERPRISE', 'Enterprise'],
    ['FREE_TRIAL', 'Free Trial'],
  ];
</script>


<Collapse title="Register Seller"
  show
  class="overflow-visible"
>
  <div slot="content" class="collapse-content">
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">First Name</span>
      </div>
      <input type="text" placeholder="first name" bind:value={data.firstName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Last Name</span>
      </div>
      <input type="text" placeholder="last name" bind:value={data.lastName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Phone</span>
      </div>
      <input type="text" placeholder="phone" bind:value={data.phone} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Company Name</span>
      </div>
      <input type="text" placeholder="company name" bind:value={data.companyName} class="input input-bordered w-full max-w-xs" />
    </label>
    <DropdownSelect
      class="my-4"
      options={SubscriptionTypeOptions}
      placeholder="subscription type"
      bind:selectValue={data.subscriptionType}
    />
    <div>
      <PostButton
        path="/auth/register"
        {client}
        {data}
      >
        Register
      </PostButton>
    </div>
  </div>
</Collapse>
