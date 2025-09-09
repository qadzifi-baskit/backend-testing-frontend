<script lang="ts">
  import type { EntityCategory } from '@/types/entityCategory';
  import { FaSolidLayerGroup } from 'svelte-icons-pack/fa';
  import IconButton from '../atoms/IconButton.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import EntityCategoryManagement from './EntityCategoryManagement.svelte';
  import EntityCategoryMemberDetail from './EntityCategoryMemberDetail.svelte';

  type Props = {
    show?: boolean,
    title?: string,
    path: string,
    includeTagParamName?: string,
    excludeTagParamName?: string,
  };
  let {
    show = $bindable(),
    title = 'Entity Category Member Management',
    ...detailProps
  }: Props = $props();

  let selectedCategory = $state<EntityCategory>();

  let categoryDetailDialog = $state<HTMLDialogElement>();
  function openCategoryDetail(item: EntityCategory) {
    selectedCategory = item;
    categoryDetailDialog?.showModal();
  }
</script>

<EntityCategoryMemberDetail
  {...detailProps}
  bind:dialog={categoryDetailDialog}
  bind:category={selectedCategory}
/>
<Collapse5 {title} bind:show>
  <EntityCategoryManagement title="" alwaysshow parentname="UNIT_TYPE">
    {#snippet action(category)}
      <IconButton icon={FaSolidLayerGroup} onclick={() => openCategoryDetail(category)}/>
    {/snippet}
  </EntityCategoryManagement>
</Collapse5>
