<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { UserOffline } from '@/types/user';
  import type { Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    value?: string,
    search?: string,
    companyId?: string,
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
  };

  let {
    value = $bindable(),
    companyId = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('User Offline'),
    label = placeholder,
  }: Props = $props();

  const { client } = Context.strict;

  let show = $state(false);
  let userList:UserOffline[] = $state([]);

  async function getUserList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    if (companyId) {
      params.append('companyId', companyId);
    }
    const response = await client.get('/user-offline', { params });
    if (response.status !== 200) return stringToast('Failed get user');
    userList = response.data.data ?? [];
  }

  $effect(() => {
    if (show) {
      getUserList();
    }
  });
</script>

<fieldset>
  {#if typeof label === 'string'}
    <span class="fieldset-label mb-2">{label}</span>
  {:else}
    {@render label()}
  {/if}
  <DropdownSelect
    bind:search
    bind:show
    bind:value
    bind:placeholder
    display="LABEL"
    options={userList.map((user) => [
      user.id,
      `${user.firstName ?? '-'} ${user.lastName ?? '-'}`,
    ])}
  />
</fieldset>
