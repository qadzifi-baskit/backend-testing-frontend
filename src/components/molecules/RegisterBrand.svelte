<script lang="ts">
  import { DigitText, DigitTextID } from '@/consts/number';
  import type { CompanyType } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import PostButton from '../atoms/PostButton.svelte';
  import { listenConfigChange } from '@/event';

  type Props = {
    client: AxiosInstance,
  };

  let {
    client,
  }:Props = $props();

  const phonePrefix = '+62999999994';
  const prefixOffset = phonePrefix.length;

  let brandCompanyTypeList:CompanyType[] = $state([]);
  let brandBranchCompanyTypeList:CompanyType[] = $state([]);
  let autoAdjust = $state(import.meta.env.MODE === 'development');

  const data = $state({
    companyType: 'Brand',
    companyTypeId: '',
    phone: '+6299999999499',
    email: 'nine.nine@brand.testing.com',
    firstName: 'Nine',
    lastName: 'Nine',
    companyName: 'Brand Sembilan Sembilan',
    personInCharge: 'PIC Sembilan Sembilan',
    roleName: 'BRAND_USER',
    branch: {
      firstName: 'Nine',
      lastName: 'Nine',
      roleName: 'BRAND_BRANCH_USER',
      companyTypeId: '',
      email: 'nine.nine@brand-branch.testing.com',
      phone: '+6299999999399',
      companyName: 'Brand Branch Sembilan Sembilan',
      personInCharge: 'PIC Sembilan Sembilan',
      address: 'Jl. Toko Brand Branch No. 99',
    },
  });

  $effect(() => {
    if (!autoAdjust) return;
    const firstDigit = data.phone.slice(prefixOffset, prefixOffset + 1);
    const firstName = DigitText[firstDigit] ?? '-';
    const lastDigit = data.phone.slice(prefixOffset + 1, prefixOffset + 2);
    const lastName = DigitText[lastDigit] ?? '-';
    data.firstName = firstName;
    data.lastName = lastName;
    data.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@brand.testing.com`;
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

  $effect(() => {
    if (!autoAdjust) return;
    const firstDigit = data.branch.phone.slice(prefixOffset, prefixOffset + 1);
    const firstName = DigitText[firstDigit] ?? '-';
    const lastDigit = data.branch.phone.slice(prefixOffset + 1, prefixOffset + 2);
    const lastName = DigitText[lastDigit] ?? '-';
    data.branch.firstName = firstName;
    data.branch.lastName = lastName;
    data.branch.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@brand-branch.testing.com`;
    data.branch.address = `Jl. Toko Brand Branch No. ${firstDigit}${lastDigit}`;
    data.branch.companyName = [
      'Brand Branch',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
    data.branch.personInCharge = [
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

  async function getBrandBranchCompanyTypeList() {
    const response = await client.get('/company/type?name=Brand%20Branch&type=BRAND');
    if (response.status !== 200) {
      return;
    }
    brandBranchCompanyTypeList = response.data?.data ?? [];
    brandBranchCompanyTypeList = [
      {
        id: '',
        type: '',
        name: '',
        parentId: null,
      },
      ...brandBranchCompanyTypeList,
    ];
    data.branch.companyTypeId =  brandBranchCompanyTypeList.toReversed()[0].id;
  }

  listenConfigChange(() => {
    getBrandCompanyTypeList();
    getBrandBranchCompanyTypeList();
  });

  const onsuccess = async () => {
    console.log({ message: 'Register success' });
  };
  let ktpFiles:FileList|undefined = $state();
  let npwpFiles:FileList|undefined = $state();
  let aktaFiles:FileList|undefined = $state();
</script>

<Collapse
  title="Register Brand"
  class="w-full"
>
  <div class="form-control w-fit">
    <label class="label cursor-pointer">
      <input type="checkbox" class="toggle" bind:checked={autoAdjust}/>
      <span class="label-text ml-4">Auto Adjust</span>
    </label>
  </div>
  <div class="text-lg font-medium">Brand</div>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">KTP</span>
    </div>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs"
      bind:files={ktpFiles}
    />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">NPWP</span>
    </div>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs"
      bind:files={npwpFiles}
    />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Akta</span>
    </div>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs"
      bind:files={aktaFiles}
    />
  </label>
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
  <div class="my-2 text-lg font-medium">Branch</div>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">First Name</span>
    </div>
    <input type="text" placeholder="first name" bind:value={data.branch.firstName} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Last Name</span>
    </div>
    <input type="text" placeholder="last name" bind:value={data.branch.lastName} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">E-Mail</span>
    </div>
    <input type="text" placeholder="e-mail" bind:value={data.branch.email} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Phone</span>
    </div>
    <input type="text" placeholder="phone" bind:value={data.branch.phone} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Company Name</span>
    </div>
    <input type="text" placeholder="company name" bind:value={data.branch.companyName} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Address</span>
    </div>
    <input type="text" placeholder="address" bind:value={data.branch.address} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Person In Charge</span>
    </div>
    <input type="text" placeholder="person in charge" bind:value={data.branch.personInCharge} class="input input-bordered w-full max-w-xs" />
  </label>
  <Select
    bind:value={data.branch.companyTypeId}
    showValue
    title="Company Type"
    options={brandBranchCompanyTypeList.map(({
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
  <PostButton
    {client}
    {data}
    path='/auth/register'
    {onsuccess}
  >
    Register
  </PostButton>
</Collapse>
