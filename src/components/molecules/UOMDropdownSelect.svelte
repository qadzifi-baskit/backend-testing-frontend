<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import type { UOM } from '@/types/product';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    client: AxiosInstance,
    value?: string,
    search?: string,
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
  };

  let {
    client,
    value = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('Uom'),
    label = placeholder,
  }: Props = $props();

  let show = $state(false);
  let uomList:UOM[] = $state([]);

  async function getUomList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    const response = await client.get('/uom', { params });
    if (response.status !== 200) return stringToast('Failed get uom');
    uomList = response.data.data ?? [];
  }

  $effect(() => {
    if (show) {
      getUomList();
    } else if (value) {
      getUomList();
    }
  });
</script>

<fieldset>
  {#if typeof label === 'string'}
    <span class="fieldset-label mb-2 capitalize">{label}</span>
  {:else}
    {@render label()}
  {/if}
  <DropdownSelect
    resetable
    bind:search
    bind:show
    bind:placeholder
    display="LABEL"
    bind:value
    options={uomList.map((uom) => [
      uom.id,
      uom.name,
    ])}
  />
  <span class="fieldset-label text-xs">{value ?? 'value'}</span>
</fieldset>
