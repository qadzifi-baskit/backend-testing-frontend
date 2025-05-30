<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Brand } from '@/types';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    value?: string,
    search?: string,
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
    onselect?: (value?: Brand) => void,
  };

  let {
    value = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('Brand'),
    label = placeholder,
    onselect: onParentSelect,
  }: Props = $props();

  const client = Context.strict.client;

  let show = $state(false);
  let brandList:Brand[] = $state([]);

  async function getBrandList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    const response = await client.get('/brand', { params });
    if (response.status !== 200) return stringToast('Failed get user');
    brandList = response.data.data ?? [];
  }

  $effect(() => {
    if (show) {
      getBrandList();
    }
  });

  function onselect(selectedValue?: string) {
    if (onParentSelect) {
      if (selectedValue) {
        onParentSelect(JSON.parse(selectedValue));
      } else {
        onParentSelect(undefined);
      }
    } else {
      value = selectedValue;
    }
  }
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
    {onselect}
    options={brandList.map((brand) => [
      JSON.stringify(brand),
      brand.name,
    ])}
  />
</fieldset>
