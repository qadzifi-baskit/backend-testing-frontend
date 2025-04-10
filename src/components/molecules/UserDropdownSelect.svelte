<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import type { User } from '@/types/user';
  import type { Snippet } from 'svelte';

  type Props = {
    client: AxiosInstance,
    value?: string,
    search?: string,
    sellerId?: string,
    roleName?: string|string[],
    page?: number,
    limit?: number,
    placeholder?: string,
    label?: string|Snippet,
  };

  let {
    client,
    value = $bindable(),
    roleName,
    sellerId = $bindable(),
    search = $bindable(''),
    page = 1,
    limit = 10,
    placeholder = $bindable('User'),
    label = placeholder,
  }: Props = $props();

  let show = $state(false);
  let userList:User[] = $state([]);

  async function getUserList() {
    const params = new URLSearchParams({
      $page: `${page}`,
      $limit: `${limit}`,
      search,
    });
    if (typeof roleName === 'string') {
      params.append('roleName', roleName);
    } else if (Array.isArray(roleName)) {
      roleName.forEach((name) => {
        params.append('roleName', name);
      });
    }
    if (sellerId) {
      params.append('sellerId', sellerId);
    }
    const response = await client.get('/company/user', { params });
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
    <span class="fieldset-label mb-2 capitalize">{label}</span>
  {:else}
    {@render label()}
  {/if}
  <DropdownSelect
    bind:search
    bind:show
    bind:placeholder
    display="LABEL"
    bind:value
    options={userList.map((user) => [
      user.id,
      `${user.profile?.firstName ?? '-'} ${user.profile?.lastName ?? '-'}`,
    ])}
  />
</fieldset>
