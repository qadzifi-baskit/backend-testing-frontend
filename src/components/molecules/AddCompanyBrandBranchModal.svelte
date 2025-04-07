<script lang="ts">
  import { DigitText, DigitTextID } from '@/consts/number';
  import type { CompanyType } from '@/types';
  import type { AxiosInstance } from 'axios';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import Modal from '../Modal.svelte';
  import Select from '../Select.svelte';
  import { listenConfigChange } from '@/event';

  type Props = {
    client: AxiosInstance,
    brandId: string,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    brandId = $bindable(''),
    dialog = $bindable(),
  }:Props = $props();

  const phonePrefix = '+62999999994';
  const prefixOffset = phonePrefix.length;

  let brandBranchCompanyTypeList:CompanyType[] = $state([]);
  let autoAdjust = $state(import.meta.env.MODE === 'development');

  const data = $state({
    firstName: 'Nine',
    lastName: 'Nine',
    roleName: 'BRAND_BRANCH_USER',
    companyTypeId: '',
    email: 'nine.nine@brand-branch.testing.com',
    phone: '+6299999999399',
    companyName: 'Brand Branch Sembilan Sembilan',
    personInCharge: 'PIC Sembilan Sembilan',
    address: 'Jl. Toko Brand Branch No. 99',
    parentId: brandId,
  });

  $effect(() => {
    data.parentId = brandId;
  });

  $effect(() => {
    if (!autoAdjust) return;
    const firstDigit = data.phone.slice(prefixOffset, prefixOffset + 1);
    const firstName = DigitText[firstDigit] ?? '-';
    const lastDigit = data.phone.slice(prefixOffset + 1, prefixOffset + 2);
    const lastName = DigitText[lastDigit] ?? '-';
    data.firstName = firstName;
    data.lastName = lastName;
    data.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@brand-branch.testing.com`;
    data.address = `Jl. Toko Brand Branch No. ${firstDigit}${lastDigit}`;
    data.companyName = [
      'Brand Branch',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
    data.personInCharge = [
      'PIC',
      DigitTextID[firstName],
      DigitTextID[lastName],
    ].join(' ');
  });

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
    data.companyTypeId =  brandBranchCompanyTypeList.toReversed()[0].id;
  }

  listenConfigChange(() => {
    getBrandBranchCompanyTypeList();
  });

  $effect(() => {
    getBrandBranchCompanyTypeList();
  });

  function onsuccess() {
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  <div class="form-control w-fit">
    <label class="label cursor-pointer">
      <input type="checkbox" class="toggle" bind:checked={autoAdjust}/>
      <span class="label-text ml-4">Auto Adjust</span>
    </label>
  </div>
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
      <span class="label-text">Address</span>
    </div>
    <input type="text" placeholder="address" bind:value={data.address} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Person In Charge</span>
    </div>
    <input type="text" placeholder="person in charge" bind:value={data.personInCharge} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Company Brand Id</span>
    </div>
    <input type="text" placeholder="person in charge" bind:value={data.personInCharge} class="input input-bordered w-full max-w-xs" />
  </label>
  <Select
    bind:value={data.companyTypeId}
    showvalue
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
  <SubmitButton
    {client}
    {data}
    path='/users/brand/branch'
    {onsuccess}
  >
    Register
  </SubmitButton>
</Modal>
