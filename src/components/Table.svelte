<script lang="ts" generics="T extends Object">
  import '@andypf/json-viewer';
  // eslint-disable-next-line no-undef
  type Key = keyof T;
  // eslint-disable-next-line no-undef
  export let itemList: T[] = [];
  export let keyList:Key[] = [
    ...<Key[]>Object.keys(itemList[0] ?? {}),
  ];
  export let headerList: string[] = <string[]>keyList;
</script>

<div class="overflow-x-auto">
  <table class="table">
    <thead>
      <tr>
        <slot name="header">
          {#each headerList as header}
            <th>
              <span class="capitalize">{header.split(/(?=[A-Z])/).join(' ')}</span>
            </th>
          {/each}
        </slot>
      </tr>
    </thead>
    <tbody>
      {#each itemList as item, index}
        <tr>
          <slot name="item" {item} {index}>
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
          </slot>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
