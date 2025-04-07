<script lang="ts">
  import { AreaParentParamKey } from '@/consts/area';
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import { AreaType, type Area } from '@/types/area';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import type { Writable } from 'svelte/store';
  import DropdownSelect from './DropdownSelect.svelte';

  type Props = {
    type?: AreaType,
    placeholder?: string,
    label?: string|Snippet,
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    parentId?: number|null,
    value?: number|null,
    default?: number|null,
  };
  let {
    type: areaType = AreaType.PROVINCE,
    placeholder = areaType.toLowerCase(),
    label = placeholder,
    client,
    store,
    parentId = $bindable(),
    value = $bindable(),
    default: defaultValue,
  }: Props = $props();

  let areaList:Area[] = $state([]);
  let search = $state('');
  async function getAreaList() {
    if (!$store || !$store.loggedIn) return;
    const params = new URLSearchParams({
      type: areaType,
      search,
    });
    if (areaType !== AreaType.PROVINCE && parentId) {
      params.append(AreaParentParamKey[areaType] ?? 'parentId', `${parentId}`);
    }
    const response = await client.get('/area', { params });
    if (response.status !== 200) return stringToast('Failed to get area list');
    areaList = response.data.data ?? [];
  }
  $effect(() => {
    if ($store && $store.loggedIn) {
      getAreaList();
    }
  });
  const debounceGetAreaList = debounce(getAreaList);
  $effect(() => {
    search;
    debounceGetAreaList();
  });
</script>

<fieldset>
  {#if typeof label === 'string'}
    <span class="label-text capitalize">{label}</span>
  {:else}
    {@render label()}
  {/if}
  <DropdownSelect
    bind:search
    bind:value
    options={areaList.map((province) => [province.id, province.name])}
    showvalue
    default={defaultValue}
    resetable
    display="LABEL"
    {placeholder}
  />
</fieldset>
