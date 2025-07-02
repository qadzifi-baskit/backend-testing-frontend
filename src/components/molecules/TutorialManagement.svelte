<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Tutorial } from '@/types/tutorial';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil, FaSolidTrash } from 'svelte-icons-pack/fa';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddTutorialModal from './AddTutorialModal.svelte';
  import ModifyTutorialModal from './ModifyTutorialModal.svelte';
  import { cancelableDebounce } from '@/lib/helper/util';

  type Props = {
    ownerId?: string;
    referenceId?: string;
    show?: boolean;
  };
  let {
    ownerId = $bindable(),
    referenceId = $bindable(),
    show = $bindable(),
  }: Props = $props();

  const { client, auth } = Context.strict;

  let search = $state('');
  let completedBy = $state('');
  let page = $state(1);
  let limit = $state(10);
  let max = $state(1);

  $effect(() => {
    search;
    completedBy;
    ownerId;
    referenceId;
    limit;
    page = 1;
  });

  let tutorialList = $state([]);

  export async function reloadData() {
    if (!$auth.loggedIn) {
      return stringToast('Not logged in');
    }
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
      $limit: `${limit}`,
    });
    if (completedBy !== '') {
      params.append('completedBy', completedBy);
    }
    if (ownerId) {
      params.append('ownerId', ownerId);
    }
    if (referenceId) {
      params.append('referenceId', referenceId);
    }
    const response = await client.get('/tutorial', { params });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    tutorialList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 0;
  }

  const deferReload = () => setTimeout(reloadData);
  const [debounceReload] = cancelableDebounce(deferReload);

  $effect(() => {
    if (show) {
      deferReload();
    }
  });
  $effect(() => {
    if (show) {
      search;
      completedBy;
      ownerId;
      referenceId;
      limit;
      page;
      debounceReload();
    }
  });


  let addTutorialDialog:HTMLDialogElement|undefined = $state();
  function showAddModal() {
    addTutorialDialog?.showModal();
  }

  let modifyTutorialDialog:HTMLDialogElement|undefined = $state();
  let selectedTutorial:Tutorial|undefined = $state();
  function modifyTutorial(tutorial: Tutorial) {
    return () => {
      selectedTutorial = tutorial;
      modifyTutorialDialog?.showModal();
    };
  }

  async function deleteTutorial(id: string) {
    if (!$auth.loggedIn) {
      return stringToast('Not logged in');
    }
    const response = await client.delete(`/tutorial/${id}`);
    if (response.status !== 200) {
      return stringToast('Failed to delete tutorial');
    }
    await reloadData();
  }

  $inspect({ limit });
</script>

<AddTutorialModal
  bind:dialog={addTutorialDialog}
  {client}
  store={auth}
  onsuccess={reloadData}
/>
<ModifyTutorialModal
  {client}
  bind:item={selectedTutorial}
  bind:dialog={modifyTutorialDialog}
  onsuccess={reloadData}
/>
<Collapse5
  title="Tutorial Management"
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    bind:limit
    onreload={reloadData}
    onadd={showAddModal}
  />
  <label class="form-control w-full max-w-xs mb-2">
    <div class="label">
      <span class="label-text">Completed By</span>
    </div>
    <input type="text" placeholder="completed by" bind:value={completedBy} class="input input-bordered w-full max-w-xs" />
  </label>
  <Table5
    itemList={tutorialList}
  >
    {#snippet table(tableContent: Snippet)}
      <table class="table table-zebra table-pin-cols">
        {@render tableContent()}
      </table>
    {/snippet}

    {#snippet colgroup()}
      <colgroup>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col class="max-w-fit">
      </colgroup>
    {/snippet}

    {#snippet header()}
      <th>Completed</th>
      <td>Id</td>
      <td>Owner Id</td>
      <td>Reference Id</td>
      <td></td>
      <td>Name</td>
      <td>Title</td>
      <td>Description</td>
      <td>Number</td>
      <th>Delete</th>
    {/snippet}

    {#snippet content(tutorial: Tutorial)}
      <th>
        <input disabled type="checkbox" checked={tutorial.completed} class="checkbox"/>
      </th>
      <td><NoWrap><code>{tutorial.id}</code></NoWrap></td>
      <td><NoWrap><code>{tutorial.ownerId}</code></NoWrap></td>
      <td><NoWrap><code>{tutorial.referenceId}</code></NoWrap></td>
      <td>
        <button class="btn btn-secondary"
          onclick={modifyTutorial(tutorial)}
        >
          <Icon src={FaSolidPencil}/>
        </button>
      </td>
      <td><NoWrap>{tutorial.name}</NoWrap></td>
      <td><NoWrap>{tutorial.title}</NoWrap></td>
      <td><NoWrap>{tutorial.description}</NoWrap></td>
      <td><NoWrap>{tutorial.number}</NoWrap></td>
      <th>
        <button class="btn btn-secondary"
          onclick={() => deleteTutorial(tutorial.id)}
        >
          <Icon src={FaSolidTrash}/>
        </button>
      </th>
    {/snippet}
  </Table5>
</Collapse5>
