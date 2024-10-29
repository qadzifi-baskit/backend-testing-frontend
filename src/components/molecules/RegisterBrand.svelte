<script lang="ts">
  import { DigitText, DigitTextID } from '@/consts/number';
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import PostButton from '../atoms/PostButton.svelte';

  const phonePrefix = '+62999999994';
  const prefixOffset = phonePrefix.length;

  const data = $state({
    companyType: 'Brand',
    phone: '+6299999999499',
    firstName: 'Nine',
    lastName: 'Nine',
    companyName: 'Brand Sembilan Sembilan',
  });

  $effect(() => {
    const firstName = DigitText[data.phone.slice(prefixOffset, prefixOffset + 1)] ?? '-';
    const lastName = DigitText[data.phone.slice(prefixOffset + 1, prefixOffset + 2)] ?? '-';
    data.firstName = firstName;
    data.lastName = lastName;
    data.companyName = [
      'Brand',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
  });

  type Props = {
    client: AxiosInstance,
  };

  let {
    client,
  }:Props = $props();

  const onResponse = async () => {
    console.log({ message: 'Register success' });
  };
</script>

<Collapse
  title="Register Brand"
  class="w-full"
  show
>
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
    <input type="text" placeholder="last name" bind:value={data.phone} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Brand Company Name</span>
    </div>
    <input type="text" placeholder="last name" bind:value={data.companyName} class="input input-bordered w-full max-w-xs" />
  </label>
  <div class="label"></div>
  <PostButton
    {client}
    {data}
    path='/auth/register'
    {onResponse}
  >
    Register
  </PostButton>
</Collapse>
