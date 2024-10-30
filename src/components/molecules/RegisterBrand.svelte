<script lang="ts">
  import { DigitText, DigitTextID } from '@/consts/number';
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import PostButton from '../atoms/PostButton.svelte';
  import type { CompanyType } from '@/types';
  import Select from '../Select.svelte';

  const phonePrefix = '+62999999994';
  const prefixOffset = phonePrefix.length;

  let brandCompanyTypeList:CompanyType[] = $state([]);

  const data = $state({
    companyType: 'Brand',
    companyTypeId: '',
    phone: '+6299999999499',
    email: 'nine.nine@testing.com',
    firstName: 'Nine',
    lastName: 'Nine',
    companyName: 'Brand Sembilan Sembilan',
    personInCharge: 'PIC Sembilan Sembilan',
    roleName: 'BRAND_USER',
  });

  $effect(() => {
    const firstDigit = data.phone.slice(prefixOffset, prefixOffset + 1);
    const firstName = DigitText[firstDigit] ?? '-';
    const lastDigit = data.phone.slice(prefixOffset + 1, prefixOffset + 2);
    const lastName = DigitText[lastDigit] ?? '-';
    data.firstName = firstName;
    data.lastName = lastName;
    data.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@testing.com`;
    data.companyName = [
      'Brand',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
    data.personInCharge = [
      'PIC',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
  });

  async function getBrandCompanyTypeList() {
    const response = await client.get('/company/type?name=Brand&type=BRAND');
    if (response.status !== 200) {
      return;
    }
    brandCompanyTypeList = response.data?.data ?? [];
    brandCompanyTypeList = [
      {
        id: '',
        type: '',
        name: '',
        parentId: null,
      },
      ...brandCompanyTypeList,
    ];
    data.companyTypeId =  brandCompanyTypeList.toReversed()[0].id;
  }

  $effect(() => {
    getBrandCompanyTypeList();
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
  <div class="text-lg font-medium">Brand</div>
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
      <span class="label-text">E-Mail</span>
    </div>
    <input type="text" placeholder="e-mail" bind:value={data.email} class="input input-bordered w-full max-w-xs" />
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
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Person In Charge</span>
    </div>
    <input type="text" placeholder="person in charge" bind:value={data.personInCharge} class="input input-bordered w-full max-w-xs" />
  </label>
  <Select
    bind:value={data.companyTypeId}
    showValue
    title="Company Type"
    options={brandCompanyTypeList.map(({
      name,
      type,
      id,
    }, index) => [
      id,
      index !== 0 ? `${name} (${type})` : '',
      index === 0,
    ])}
  />
  <div class="label"></div>
  <div class="text-lg font-medium">Branch</div>
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
