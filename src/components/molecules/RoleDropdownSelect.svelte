<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import type { Role } from '@/types/user';
  import type { ComponentProps, Snippet } from 'svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = Partial<ComponentProps<typeof DropdownSelect<string, string, string>>> & {
    label?: string|Snippet|null,
    name?: string|null,
    excludeId?: string|string[]|null,
    'display-name'?: boolean,
  };
  let {
    label = 'Role',
    placeholder = $bindable('Select a role'),
    show = $bindable(false),
    value = $bindable(),
    name = $bindable(),
    excludeId = $bindable(null),
    onselect,
    'display-name': displayName,
  }:Props = $props();

  const { client, auth } = Context.strict;

  let roleList:Role[] = $state([]);
  let search = $state('');
  async function getRoleList() {
    if (!$auth.loggedIn) return stringToast('Not logged in');
    const params = new URLSearchParams({
      search,
    });

    if (Array.isArray(excludeId)) {
      excludeId.forEach((id) => params.append('excludeId', id));
    } else if (excludeId) {
      params.append('excludeId', excludeId);
    }

    const response = await client.get('/role', { params });
    if (response.status !== 200) return stringToast('Failed to get role list');
    roleList = response.data.data ?? [];
  }

  const debounceGetRoleList = debounce(getRoleList);
  $effect(() => {
    if (show) {
      search;
      debounceGetRoleList();
    }
  });

  $effect(() => {
    name = roleList.find((role) => role.id === value)?.roleName ?? null;
  });
</script>

<label>
  {#if typeof label === 'string'}
    <span class="fieldset-label mb-2 capitalize">{label}</span>
  {:else}
    {@render label?.()}
  {/if}
  <DropdownSelect
    bind:value
    bind:show
    bind:search
    bind:placeholder
    display={displayName ? 'LABEL' : 'VALUE'}
    options={roleList.map((role) => [role.id, role.roleName])}
    {onselect}
  />
</label>
