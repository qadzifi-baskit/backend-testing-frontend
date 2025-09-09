<script lang="ts" generics="DT extends object">
  import type { EntityCategory } from '@/types/entityCategory';
  import Modal from '../Modal.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { getPaginationParams } from '@/lib/helper/pagination';
  import Table5 from '../Table5.svelte';
  import type { Snippet } from 'svelte';

  // eslint-disable-next-line no-undef
  type DataType = DT;

  type Props = {
    dialog?: HTMLDialogElement,
    category?: EntityCategory,
    path: string,
    includeTagParamName?: string,
    excludeTagParamName?: string,
    colgroup?: Snippet,
    header: Snippet,
    memberContent: Snippet<[DataType, number]>,
    nonMemberContent: Snippet<[DataType, number]>,
  };
  let {
    dialog = $bindable(),
    category = $bindable(),
    path,
    includeTagParamName = 'tagName',
    excludeTagParamName = 'excludeTagName',
    colgroup,
    header,
    memberContent,
    nonMemberContent,
  }: Props = $props();

  const {
    auth,
    client,
  } = Context.strict;

  let memberList:DataType[] = $state([]);
  let {
    search: memberSearch,
    max: memberMax,
    page: memberPage,
    limit: memberLimit,
  } = $state(getPaginationParams());
  async function getMember() {
    if (!$auth.loggedIn) return stringToast('Not logged in');;
    if (!path) return stringToast('Path is not defined');
    if (!category) return stringToast('Category is not selected');
    if (!includeTagParamName) return stringToast('includeTagParamName is not defined');
    stringToast('Loading category members...');
    const params = new URLSearchParams({
      [includeTagParamName]: category.name,
      search: memberSearch,
      $limit: `${memberLimit}`,
      $page: `${memberPage}`,
    });
    const response = await client.get(path, {
      params,
    });
    if (response.status !== 200) {
      return stringToast('Failed to load category members');
    }
    memberList = response.data.data ?? [];
    memberMax = response.data.totalPage ?? 1;
  }

  let nonMemberList:DataType[] = $state([]);
  let {
    search: nonMemberSearch,
    max: nonMemberMax,
    page: nonMemberPage,
    limit: nonMemberLimit,
  } = $state(getPaginationParams());
  async function getNonMember() {
    if (!$auth.loggedIn) return stringToast('Not logged in');;
    if (!path) return stringToast('Path is not defined');
    if (!category) return stringToast('Category is not selected');
    if (!excludeTagParamName) return stringToast('excludeTagParamName is not defined');
    stringToast('Loading non-category members...');
    const params = new URLSearchParams({
      [excludeTagParamName]: category.name,
      search: nonMemberSearch,
      $limit: `${nonMemberLimit}`,
      $page: `${nonMemberPage}`,
    });
    const response = await client.get(path, {
      params,
    });
    if (response.status !== 200) {
      return stringToast('Failed to load non-category members');
    }
    nonMemberList = response.data.data ?? [];
    nonMemberMax = response.data.totalPage ?? 1;
  }
</script>

<Modal bind:dialog title={category?.label}>
  <div class="flex w-full h-full">
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <PaginationNavigationPanel
        bind:search={memberSearch}
        bind:page={memberPage}
        bind:max={memberMax}
        bind:limit={memberLimit}
        onreload={getMember}
      />
      <Table5 itemList={memberList}
        {colgroup}
        {header}
        content={memberContent}
      >
      </Table5>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <PaginationNavigationPanel
        bind:search={nonMemberSearch}
        bind:page={nonMemberPage}
        bind:max={nonMemberMax}
        bind:limit={nonMemberLimit}
        onreload={getNonMember}
      />
      <Table5 itemList={nonMemberList}
        {colgroup}
        {header}
        content={nonMemberContent}
      >
      </Table5>
    </div>
  </div>
</Modal>
