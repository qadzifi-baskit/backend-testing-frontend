<script lang="ts" generics="T extends Object">
  type Key = keyof T;
  export let itemList: T[] = [];
  export let headerList: string[] = [
    ...Object.keys(itemList[0] ?? {}),
  ];
  export let keyList:Key[] = [
    ...<Key[]>Object.keys(itemList[0] ?? {}),
  ];

  console.log({
    itemList,
    headerList,
    keyList,
  });
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
      {#each itemList as item}
      <tr>
        <slot name="item" {item}>
          {#each keyList as key}
          <td> {item[key]} </td>
          {/each}
        </slot>
      </tr>
      {/each}
    </tbody>
  </table>
</div>