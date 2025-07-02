<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Company } from '@/types';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import { cancelableDebounce } from '@/lib/helper/util';

  type Props = {
    value?: string,
    search?: string,
    sellerId?: string,
    roleName?: string|string[],
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
  };

  let {
    value = $bindable(),
    sellerId = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('Company'),
    label = placeholder,
  }: Props = $props();

  const { client } = Context.strict;

  let show = $state(false);
  let companyList:Company[] = $state([]);

  async function getCompanyList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    ['SELLER', 'BASKIT', 'BRAND', 'CHANNEL'].forEach(
      (companyType) => params.append('companyType', companyType),
    );
    if (sellerId) {
      params.append('sellerId', sellerId);
    }
    const response = await client.get('/company/seller', { params });
    if (response.status !== 200) return stringToast('Failed get company');
    companyList = response.data.data ?? [];
  }

  const [debounce, cancel] = cancelableDebounce(getCompanyList);

  $effect(() => {
    if (show) {
      search;
      cancel();
      debounce();
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
    bind:search
    bind:show
    bind:placeholder
    display="LABEL"
    bind:value
    options={companyList.map((company) => [
      company.id,
      company.companyName,
    ])}
  />
</fieldset>
