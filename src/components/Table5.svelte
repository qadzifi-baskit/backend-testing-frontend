<script lang="ts" generics="T extends Object">
  import { cn } from '@/lib/helper/tailwind';
  import '@andypf/json-viewer';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type DataType = T;
  type Key = keyof DataType;
  type Props = {
    itemList?: DataType[],
    class?: string,
    headerList?: string[],
    keyList?: Key[],
    table?: Snippet<[Snippet]>,
    colgroup?: Snippet,
    header?: Snippet,
    content?: Snippet<[DataType, number]>,
    firstRow?: Snippet,
    lastRow?: Snippet,
    firstColumn?: Snippet<[DataType, number]>,
    lastColumn?: Snippet<[DataType, number]>,
    firstHeader?: Snippet,
    lastHeader?: Snippet,
  };
  let {
    class: clazz = '',
    itemList = $bindable([]),
    headerList = Object.keys(itemList[0] ?? {}),
    keyList = <Key[]>headerList,
    table,
    colgroup,
    header,
    content,
    firstRow,
    lastRow,
    firstColumn,
    lastColumn,
    firstHeader,
    lastHeader,
  }:Props = $props();

  $effect(() => {
    if (itemList.length > 0) {
      keyList = <Key[]>Object.keys(itemList[0] ?? {});
      headerList = <string[]>keyList;
    }
  });
</script>

{#snippet tableContent()}
  {@render colgroup?.()}
  <thead>
    <tr>
      {@render firstHeader?.()}
      {#if header}
        {@render header()}
      {:else}
        {#each headerList as header}
          <td>
            <span class="capitalize">{header.split(/(?=[A-Z])/).join(' ')}</span>
          </td>
        {/each}
      {/if}
      {@render lastHeader?.()}
    </tr>
  </thead>
  <tbody>
    {@render firstRow?.()}
    {#each itemList as item, index}
      <tr class="bg-base-100">
        {@render firstColumn?.(item, index)}
        {#if content}
          {@render content(item, index)}
        {:else}
          {#each keyList as key}
            <td>
              {#if typeof item[key] === 'string'}
                <span class="whitespace-nowrap">{item[key]}</span>
              {:else if typeof item[key] === 'number'}
                {item[key]}
              {:else}
                {JSON.stringify(item[key])}
                <!-- <andypf-json-viewer data={item[key]} theme="monokai"></andypf-json-viewer> -->
              {/if}
            </td>
          {/each}
        {/if}
        {@render lastColumn?.(item, index)}
      </tr>
    {/each}
    {@render lastRow?.()}
  </tbody>
{/snippet}

<div class={cn('overflow-x-auto', clazz)}>
  {#if table}
    {@render table(tableContent)}
  {:else}
    <table class="table table-zebra">
      {@render tableContent()}
    </table>
  {/if}
</div>
