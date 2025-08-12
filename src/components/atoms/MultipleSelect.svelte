<script lang="ts" generics="VT, LT, DT">
  import DropdownSelect from './DropdownSelect.svelte';

  const randomUUID = () => window.crypto.randomUUID();

  // eslint-disable-next-line no-undef
  type ValueType = VT;
  // eslint-disable-next-line no-undef
  type DropdownParams = Parameters<typeof DropdownSelect<VT, LT, DT>>[1];
  type Props = Omit<DropdownParams, 'value'> & {
    value?: ValueType[],
  };
  let {
    value: valueList = $bindable([]),
    options = [],
    ...baseProps
  }:Props = $props();

  let select = $state<ReturnType<typeof DropdownSelect>>();
  let valuePair = $state<[string, ValueType][]>([]);

  function onselect(selectValue: ValueType) {
    valuePair = [...valuePair, [randomUUID(), selectValue]];
    select?.reset();
  }

  $effect(() => {
    valueList = valuePair.map(([_, value]) => value);
  });
</script>

<DropdownSelect
  bind:this={select}
  {...baseProps}
  {onselect}
  keepOpenOnSelect
  options={options.filter(([value]) => !valueList.includes(value))}
/>
<div class="gap-2 inline-flex">
  {#each valuePair as [key, value] (key)}
    <div class="badge badge-primary p-4 h-10">{value}</div>
  {/each}
</div>
