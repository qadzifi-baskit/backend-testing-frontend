<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import Modal from '../Modal.svelte';
  import EntityCategoryHierarchyManagement from './EntityCategoryHierarchyManagement.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    title?: string,
    categoryid?: string,
    dialog?: HTMLDialogElement,
    onupdate?: () => void|Promise<void>,
  };
  let {
    title = $bindable(),
    categoryid: categoryId = $bindable(),
    dialog = $bindable(),
    onupdate,
  }: Props = $props();

  const { client } = Context.strict;

  let childManagemntComponent: ReturnType<typeof EntityCategoryHierarchyManagement>;
  let parentManagementComponent: ReturnType<typeof EntityCategoryHierarchyManagement>;

  const payload = $state({
    name: '',
    label: '',
    description: '',
  });

  async function reloadData() {
    if (!categoryId) return;
    const response = await client.get(`/entity-category/${categoryId}`);
    if (response.status !== 200) {
      return stringToast('Failed to load category data');
    }
    Object.assign(payload, response.data.data ?? {});
    return stringToast('Category data loaded successfully');
  }

  async function onUpdate() {
    await reloadData();
    await onupdate?.();
  };
</script>

<Modal
  bind:dialog
  onopen={() => {
    reloadData();
    childManagemntComponent?.open();
    parentManagementComponent?.open();
  }}
  bind:title
>
  <div class="w-full h-full">
    <FormWrapper {payload} path={`/entity-category/${categoryId}`} method="PATCH"
      onsuccess={onUpdate}
    >
      <FormInput label="Name" bind:value={payload.name}/>
      <FormInput label="Label" bind:value={payload.label}/>
      <FormInput label="Description" bind:value={payload.description}/>
      <SubmitButton/>
    </FormWrapper>
    <div class="divider"></div>
    <EntityCategoryHierarchyManagement
      bind:this={childManagemntComponent}
      parentid={categoryId!}
    />
    <div class="divider"></div>
    <EntityCategoryHierarchyManagement
      bind:this={parentManagementComponent}
      parentofid={categoryId!}
    />
  </div>
</Modal>
