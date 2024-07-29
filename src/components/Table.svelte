<script lang="ts" generics="T extends Object">
  // eslint-disable-next-line no-undef
  type Key = keyof T;
  // eslint-disable-next-line no-undef
  export let itemList: T[] = [];
  export let keyList:Key[] = [
    ...<Key[]>Object.keys(itemList[0] ?? {}),
  ];
  export let headerList: unknown[] = keyList;
</script>

<div class="overflow-x-auto">
  <table class="table">
    <thead>
      <tr>
        <slot name="header">
          {#each headerList as header}
            <th>{header}</th>
          {/each}
        </slot>
      </tr>
    </thead>
    <tbody>
      {#each itemList as item, index}
        <tr>
          <slot name="item" {item} {index}>
            {#each keyList as key}
              <td> {item[key]} </td>
            {/each}
          </slot>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
