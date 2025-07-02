<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { EntityCategory } from '@/types/entityCategory';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    value?: string|null,
    search?: string,
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
  };

  let {
    value = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('Feature'),
    label,
  }: Props = $props();

  const { client } = Context.strict;

  let show = $state(false);
  let featureList:EntityCategory[] = $state([]);

  async function getUserList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    const response = await client.get('/feature', { params });
    if (response.status !== 200) return stringToast('Failed get user');
    featureList = response.data.data ?? [];
  }

  const [debounce, cancel] = cancelableDebounce(getUserList);

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
    {@render label?.()}
  {/if}
  <DropdownSelect
    bind:search
    bind:show
    bind:placeholder
    display="LABEL"
    bind:value
    default={null}
    options={featureList.map((feature) => [
      feature.id,
      feature.name,
    ])}
  />
</fieldset>
