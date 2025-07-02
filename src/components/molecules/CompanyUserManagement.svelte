<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import Table5 from '../Table5.svelte';
  import { cancelableDebounce } from '@/lib/helper/util';
  import AssignCompanyUserModal from './AssignCompanyUserModal.svelte';
  import RoleDropdownSelect from './RoleDropdownSelect.svelte';

  type Props = {
    title?: string,
  };
  let {
    title = 'Company User Management',
  }: Props = $props();

  const { client, auth } = Context.strict;

  let data:object[] = $state([]);
  let roleName = $state('');
  async function reloadData() {
    if (!$auth.loggedIn) return stringToast('Not logged in');
    if (!roleName) return stringToast('Please select a role');
    // Fetch company user data here
    const params = new URLSearchParams({
      roleName,
      role: roleName,
    });
    const response = await client.get('/company/user', { params });
    // Handle response and update state accordingly
    if (response.status !== 200) {
      return stringToast('Failed to load company user data');
    }
    data = response.data.data ?? [];
  }

  const [debounce, cancel] = cancelableDebounce(reloadData);

  function cancelAndReload() {
    cancel();
    debounce();
  }

  let addModal = $state<HTMLDialogElement>();
  function onadd() {
    addModal?.showModal();
  }
</script>

<AssignCompanyUserModal bind:dialog={addModal}/>
<Collapse5 {title}>
  <PaginationNavigationPanel
    onreload={cancelAndReload}
    {onadd}
  />
  <RoleDropdownSelect bind:name={roleName}/>
  <Table5 itemList={data}></Table5>
</Collapse5>
