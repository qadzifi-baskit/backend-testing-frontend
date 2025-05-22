<script lang="ts">
  import Modal from '../Modal.svelte';
  import EntityCategoryHierarchyManagement from './EntityCategoryHierarchyManagement.svelte';

  type Props = {
    title?: string,
    categoryid?: string,
    dialog?: HTMLDialogElement,
  };
  let {
    title = $bindable(),
    categoryid = $bindable(),
    dialog = $bindable(),
  }: Props = $props();

  let childManagemntComponent: ReturnType<typeof EntityCategoryHierarchyManagement>;
  let parentManagementComponent: ReturnType<typeof EntityCategoryHierarchyManagement>;
</script>

<Modal
  bind:dialog
  onopen={() => {
    childManagemntComponent?.open();
    parentManagementComponent?.open();
  }}
  bind:title
>
  <div class="w-full h-full">
    <EntityCategoryHierarchyManagement
      bind:this={childManagemntComponent}
      parentid={categoryid!}
    />
    <div class="divider"></div>
    <EntityCategoryHierarchyManagement
      bind:this={parentManagementComponent}
      parentofid={categoryid!}
    />
  </div>
</Modal>
