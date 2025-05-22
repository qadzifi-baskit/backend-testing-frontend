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
>
  {#if title}
    <div class="sticky z-10 h-0 float-right top-0">
      <div class="badge badge-primary">{title}</div>
    </div>
  {/if}
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
