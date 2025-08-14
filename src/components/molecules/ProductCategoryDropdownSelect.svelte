<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { Category } from '@/types/category';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    placeholder?: string,
    label?: string|Snippet,
    value?: string|null,
    default?: string|null,
    show?: boolean,
    disabled?: boolean,
    parentname?: string|string[],
    name?: string,
    includeEmpty?: `${boolean}`,
  };
  let {
    placeholder = 'category',
    label = placeholder,
    value = $bindable(),
    default: defaultValue,
    show = $bindable(false),
    disabled = $bindable(false),
    parentname: parentName,
    name = $bindable(),
    includeEmpty = 'true',
  }: Props = $props();

  const client = Context.getStrict('client');
  const store = Context.getStrict('auth');

  let categoryList:Category[] = $state([]);
  let search = $state('');
  async function reloadData() {
    if (!$store || !$store.loggedIn) return;
    const params = new URLSearchParams({
      search,
    });
    if (includeEmpty) {
      params.append('includeEmpty', includeEmpty);
    }
    if (parentName) {
      if (Array.isArray(parentName)) {
        parentName.forEach((name) => {
          params.append('parentName', name);
        });
      } else {
        params.append('parentName', parentName);
      }
    }
    const response = await client.get('/category', { params });
    if (response.status !== 200) return stringToast('Failed to get category list');
    categoryList = response.data.data ?? [];
  }

  const [debounceReloadData] = cancelableDebounce(reloadData);

  $effect(() => {
    if (show) {
      search;
      debounceReloadData();
    }
  });

  let categoryName = $state(name ?? placeholder);
  $effect(() => {
    if (!show) {
      if (value) {
        categoryName = name ?? placeholder;
      } else {
        categoryName = placeholder;
      }
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
    bind:show
    bind:search
    bind:value
    options={categoryList.map((category) => [category.id, category.name])}
    showvalue
    default={defaultValue}
    resetable
    display="LABEL"
    bind:placeholder={categoryName}
    bind:disabled
  />
</fieldset>
