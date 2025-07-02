<script lang="ts">
  import { AreaParentParamKey } from '@/consts/area';
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import { AreaType, type Area } from '@/types/area';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import type { Writable } from 'svelte/store';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    type?: AreaType,
    placeholder?: string,
    label?: string|Snippet,
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    parentId?: number|null,
    value?: number|null,
    default?: number|null,
    show?: boolean,
    disabled?: boolean,
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
    show = $bindable(false),
    disabled = $bindable(false),
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

  const debounceGetAreaList = debounce(getAreaList);
  $effect(() => {
    if (show) {
      search;
      debounceGetAreaList();
    }
  });

  let areaName = $state(placeholder);
  async function getAreaName() {
    if (!value) return;
    const response = await client.get(`/area/${value}`);
    if (response.status !== 200) return stringToast('Failed to get area name');
    const area:Area = response.data.data;
    areaName = area.name;
  }
  $effect(() => {
    if (!show) {
      if (value) {
        getAreaName();
      } else {
        areaName = placeholder;
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
    options={areaList.map((province) => [province.id, province.name])}
    showvalue
    default={defaultValue}
    resetable
    display="LABEL"
    bind:placeholder={areaName}
    bind:disabled
  />
</fieldset>
