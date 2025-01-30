<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import { SuperAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { Translation } from '@/types/translation';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import AddTranslationModal from './AddTranslationModal.svelte';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
  };
  let {
    client,
    store = SuperAdminStore,
  }: Props = $props();

  let translationList:Translation[] = $state([]);
  let search = $state(''); 
  let page = $state(1);
  let max = $state(1);

  async function reloadData() {
    if (!$store.loggedIn) {
      return stringToast('Not logged in');
    }

    stringToast('Loading...');

    const response = await client.get('/translation');
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    stringToast('Data loaded');

    translationList = response.data?.data ?? [];
  }

  let addTranslationDialog:HTMLDialogElement|undefined = $state();
  function showAddModal() {
    addTranslationDialog?.showModal();
  }
</script>

{#snippet content(translation: Translation)}
  <td><NoWrap>{translation.id}</NoWrap></td>
  <td><NoWrap>{translation.lang}</NoWrap></td>
  <td><NoWrap>{translation.platform}</NoWrap></td>
  <td><NoWrap>{translation.key}</NoWrap></td>
  <td><NoWrap>{translation.value}</NoWrap></td>
{/snippet}

<AddTranslationModal
  bind:dialog={addTranslationDialog}
  {client}
  onsuccess={reloadData}
/>
<Collapse5
  title="Translation Management"
  class="w-full"
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  {#if translationList.length > 0}
    <Table5
      itemList={translationList}
      {content}
    />
  {/if}
</Collapse5>
