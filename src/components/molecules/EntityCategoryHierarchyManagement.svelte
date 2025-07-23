<script lang="ts">
  import Collapse5 from '../Collapse5.svelte';
  import EntityCategoryManagement from './EntityCategoryManagement.svelte';

  type SubProps = {
    parentid: string;
  } | {
    parentofid: string;
  };
  type Props = {
    title?: string;
    subtitle?: string;
    parentid?: string;
    parentofid?: string;
  } & SubProps;
  let {
    title = 'Entity Category Hierarchy Management',
    subtitle = 'Related Entity Category Management',
    parentid,
    parentofid,
  }: Props = $props();
  const categoryid = $derived(parentid ?? parentofid);

  $effect(() => {
    if (parentid) {
      title = 'Child Category Management';
      subtitle = 'Child Category';
    } else if (parentofid) {
      title = 'Parent Category Management';
      subtitle = 'Parent Category';
    }
  });

  let _this:ReturnType<typeof Collapse5>;
  export function open() {
    _this?.open();
    relatedCategoryComponent?.cancelAndReload();
    otherCategoryComponent?.cancelAndReload();
  }

  let relatedCategoryComponent: ReturnType<typeof EntityCategoryManagement>;
  let otherCategoryComponent: ReturnType<typeof EntityCategoryManagement>;
</script>

<Collapse5 {title} bind:this={_this}>
  <div class="flex w-full h-full">
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <EntityCategoryManagement
        bind:this={relatedCategoryComponent}
        class="bg-base-300"
        alwaysshow
        title={subtitle}
        {categoryid}
        {parentid}
        {parentofid}
        removechild={Boolean(parentid)}
        removeparent={Boolean(parentofid)}
        onremovechild={() => otherCategoryComponent?.cancelAndReload()}
        onremoveparent={() => otherCategoryComponent?.cancelAndReload()}
      />
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <EntityCategoryManagement
        bind:this={otherCategoryComponent}
        class="bg-base-300"
        title="Other Category"
        {categoryid}
        alwaysshow
        addchild={Boolean(parentid)}
        addparent={Boolean(parentofid)}
        excludeid={categoryid}
        excludeparentid={parentid}
        excludeparentofid={parentofid}
        onaddchild={() => relatedCategoryComponent?.cancelAndReload()}
        onaddparent={() => relatedCategoryComponent?.cancelAndReload()}
        addcategory
      />
    </div>
  </div>
</Collapse5>
