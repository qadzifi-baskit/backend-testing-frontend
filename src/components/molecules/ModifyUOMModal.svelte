<script lang="ts">
  import type { NamedEntity } from '@/types';
  import Modal from '../Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import EntityCategoryHierarchyManagement from './EntityCategoryHierarchyManagement.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    dialog?: HTMLDialogElement,
    item?: NamedEntity,
  };
  let {
    dialog = $bindable(),
    item = $bindable(),
  }: Props = $props();

  let title = $state(item?.name ?? null);

  const payload = $state({
    name: item?.name ?? '',
  });

  $effect(() => {
    title = item?.name ?? null;
  });

  $effect(() => {
    if (item) {
      payload.name = item.name;
    } else {
      payload.name = '';
    }
  });

  let showTag = $state(false);
</script>

<Modal bind:dialog bind:title
  onopen={() => {
    showTag = true;
  }}
  onclose={() => {
    showTag = false;
  }}
>
  <FormInput label="Id" disabled value={item?.id}/>
  {#if item}
    <FormWrapper
      {payload}
      method="PATCH"
      path={`/uom/${item.id}`}
    >
      <FormInput label="Name" bind:value={payload.name} />
      <SubmitButton/>
    </FormWrapper>
  {/if}
  {#if item}
    <EntityCategoryHierarchyManagement
      tag
      parentofid={item.id}
      bind:show={showTag}
    />
  {/if}
</Modal>
