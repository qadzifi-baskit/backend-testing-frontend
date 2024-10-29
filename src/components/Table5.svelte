<script lang="ts" generics="T extends Object">
  import '@andypf/json-viewer';
  import type { Snippet } from 'svelte';
  // eslint-disable-next-line no-undef
  type Key = keyof T;
  type Props = {
    // eslint-disable-next-line no-undef
    itemList?: T[],
    headerList?: string[],
    keyList?: Key[],
    colgroup?: Snippet,
    header?: Snippet,
    // eslint-disable-next-line no-undef
    content?: Snippet<[T, number?]>,
  };
  let {
    itemList = [],
    headerList = Object.keys(itemList[0] ?? {}),
    keyList = <Key[]>headerList,
    colgroup,
    header,
    content,
  }:Props = $props();

  $effect(() => {
    keyList = <Key[]>Object.keys(itemList[0] ?? {});
    headerList = <string[]>keyList;
  });
</script>

<div class="overflow-x-auto">
  <table class="table">
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
      {#each itemList as item, index}
        <tr>
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
    </tbody>
  </table>
</div>
