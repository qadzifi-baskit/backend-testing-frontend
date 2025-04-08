<script lang="ts">
  import type { Company } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import { BrandUserStore } from '@/store/store';

  type Props = {
    client: AxiosInstance,
    company?: Company,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    company,
    dialog = $bindable(),
  }:Props = $props();

  async function save() {
    if (!company) {
      throw new Error('Company is empty');
    }
    if (!$BrandUserStore.loggedIn) {
      throw new Error('Brand user not logged in');
    }
    const response = await client.patch(
      `/company/brand/${company.id}`,
      {
        companyName: company.companyName,
        address: company.detail.address,
        personInCharge: company.detail.personInCharge,
      },
    );
    if (response.status !== 200) return;
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  {#if company}
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Company Name</span>
      </div>
      <input type="text" placeholder="company name" bind:value={company.companyName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Address</span>
      </div>
      <input type="text" placeholder="address" bind:value={company.detail.address} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">PIC</span>
      </div>
      <input type="text" placeholder="person in charge" bind:value={company.detail.personInCharge} class="input input-bordered w-full max-w-xs" />
    </label>
    <div class="label"></div>
    <button class="btn btn-secondary"
      onclick={save}
    >
      Save
    </button>
  {/if}
</Modal>
