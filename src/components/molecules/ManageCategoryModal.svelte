<script lang="ts">
  import Modal from '../Modal.svelte';
  import CategoryManagement from './CategoryManagement.svelte';
  import EntityCategoryHierarchyManagement from './EntityCategoryHierarchyManagement.svelte';

  type Props = {
    parentId: string,
    dialog?: HTMLDialogElement,
  };
  let {
    parentId = $bindable(),
    dialog = $bindable(),
  }: Props = $props();

  let showChild = $state(false);
</script>

<Modal bind:dialog
  onopen={() => {
    showChild = true;
  }}
  onclose={() => {
    showChild = false;
  }}
>
  <div class="w-full h-full">
    <CategoryManagement bind:id={parentId} bind:show={showChild}/>
    <div class="divider"></div>
    <EntityCategoryHierarchyManagement
      path="tag"
      method="PATCH"
      parentofid={parentId}
    />
  </div>
</Modal>
