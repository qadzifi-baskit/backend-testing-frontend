<script lang="ts" generics="T extends Object">
  import { cn } from '@/lib/helper/tailwind';
  import '@andypf/json-viewer';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type Key = keyof T;
  type Props = {
    // eslint-disable-next-line no-undef
    itemList?: T[],
    class?: string,
    headerList?: string[],
    keyList?: Key[],
    table?: Snippet<[Snippet]>,
    colgroup?: Snippet,
    header?: Snippet,
    firstRow?: Snippet,
    // eslint-disable-next-line no-undef
    content?: Snippet<[T, number]>,
    lastRow?: Snippet,
  };
  let {
    class: clazz = '',
    itemList = $bindable([]),
    headerList = Object.keys(itemList[0] ?? {}),
    keyList = <Key[]>headerList,
    table,
    colgroup,
    header,
    firstRow,
    content,
    lastRow,
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
      {#if header}
        {@render header()}
      {:else}
        {#each headerList as header}
          <th>
            <span class="capitalize">{header.split(/(?=[A-Z])/).join(' ')}</span>
          </th>
        {/each}
      {/if}
    </tr>
  </thead>
  <tbody>
    {#if firstRow}
      {@render firstRow()}
    {/if}
    {#each itemList as item, index}
      <tr class="bg-base-100">
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
      </tr>
    {/each}
    {#if lastRow}
      {@render lastRow()}
    {/if}
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
