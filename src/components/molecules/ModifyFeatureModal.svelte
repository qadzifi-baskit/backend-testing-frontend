<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Role } from '@/types/user';
  import AddButton from '../atoms/AddButton.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';
  import Modal from '../Modal.svelte';
  import RoleManagement from './RoleManagement.svelte';

  type Props = {
    title?: string,
    featureId?: string,
    featureName?: string,
    dialog?: HTMLDialogElement,
  };
  let {
    title = $bindable(),
    featureId = $bindable(),
    dialog = $bindable(),
  }: Props = $props();

  const { client, auth } = Context.strict;

  let assignedManagementComponent: ReturnType<typeof RoleManagement>;
  let unassignedManagementComponent: ReturnType<typeof RoleManagement>;

  function reloadData() {
    assignedManagementComponent?.reloadData();
    unassignedManagementComponent?.reloadData();
  }

  function onUnassign(role: Role) {
    return async () => {
      if (!$auth.loggedIn) {
        return stringToast('Not logged in');
      }
      const response = await client.post(
        `/feature/manage-link/${featureId}`,
        { role: { removeId: [role.id] } },
      );
      if (response.status !== 200) {
        return stringToast('Failed to unassign role to feature');
      }
      reloadData();
      return stringToast('Role unassigned successfully');
    };
  }

  function onAssign(role: Role) {
    return async () => {
      if (!$auth.loggedIn) {
        return stringToast('Not logged in');
      }
      const response = await client.post(
        `/feature/manage-link/${featureId}`,
        { role: { addId: [role.id] } },
      );
      if (response.status !== 200) {
        return stringToast('Failed to assign role to feature');
      }
      reloadData();
      return stringToast('Role assigned successfully');
    };
  }
</script>

<Modal
  bind:dialog
  onopen={() => {
    assignedManagementComponent?.open();
    unassignedManagementComponent?.open();
  }}
  bind:title
>
  <div class="flex w-full h-full">
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <RoleManagement
        bind:this={assignedManagementComponent}
        bind:featureId
      >
        {#snippet control(role)}
          <DeleteButton onclick={onUnassign(role)}/>
        {/snippet}
      </RoleManagement>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <RoleManagement
        bind:this={unassignedManagementComponent}
        bind:excludeFeatureId={featureId}
      >
        {#snippet control(role)}
          <AddButton onclick={onAssign(role)}/>
        {/snippet}
      </RoleManagement>
    </div>
  </div>
</Modal>
