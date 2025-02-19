<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { Tutorial } from '@/types/tutorial';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddTutorialModal from './AddTutorialModal.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
  };
  let {
    client,
    store,
  }: Props = $props();

  let search = $state('');
  let page = $state(1);
  let max = $state(1);

  let tutorialList = $state([]);

  async function reloadData() {
    if (!$store.loggedIn) {
      return stringToast('Not logged in');
    }
    const response = await client.get('/tutorial');
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    tutorialList = response.data?.data ?? [];
  }

  let addTutorialDialog:HTMLDialogElement|undefined = $state();
  function showAddModal() {
    addTutorialDialog?.showModal();
  }
</script>

<AddTutorialModal
  bind:dialog={addTutorialDialog}
  {client}
  {store}
/>
<Collapse5
  title="Tutorial Management"
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  <Table5
    itemList={tutorialList}
  >
    {#snippet header()}
      <td>Id</td>
      <td></td>
      <td>Name</td>
      <td>Title</td>
      <td>Description</td>
      <td>Number</td>
    {/snippet}

    {#snippet content(tutorial: Tutorial)}
      <td><NoWrap>{tutorial.id}</NoWrap></td>
      <td>
        <button class="btn bg-slate-600">
          <Icon src={FaSolidPencil}/>
        </button>
      </td>
      <td><NoWrap>{tutorial.name}</NoWrap></td>
      <td><NoWrap>{tutorial.title}</NoWrap></td>
      <td><NoWrap>{tutorial.description}</NoWrap></td>
      <td><NoWrap>{tutorial.number}</NoWrap></td>
    {/snippet}
  </Table5>
</Collapse5>
