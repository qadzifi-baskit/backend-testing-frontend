<script lang="ts" generics="VT, LT">
  import { cn } from '@/lib/helper/tailwind';
  // eslint-disable-next-line no-undef
  type ValueType = VT;
  // eslint-disable-next-line no-undef
  type LabelType = LT;

  let clazz = '';
  export { clazz as class };
  export let options:[ValueType, LabelType][] = [];
  export let placeholder = 'placeholder';
  export let selectValue:ValueType|undefined = undefined;

  let selectElement:HTMLDetailsElement|undefined;
  const onSelect = () => {
    if (selectElement) {
      selectElement.open = false;
    }
  };
</script>

<details class={cn('dropdown w-full max-w-xs', clazz)}
  bind:this={selectElement}
>
  <summary class="btn input-bordered w-full justify-start">{selectValue ?? placeholder}</summary>
  <ul class="menu input-bordered border dropdown-content bg-base-100 rounded-box z-[1000] w-52 p-0 shadow">
    {#each options as [value, label]}
      <button
        class={
          cn(
            'btn form-control block box-border rounded-none',
            'first:rounded-t-[inherit] last:rounded-b-[inherit]',
            'active:hover:animate-none active:hover:transform-none',
            'active:focus:animate-none active:focus:transform-none',
            'has-[:checked]:bg-slate-700',
          )
        }
        on:click={onSelect}
      >
        <label class="label cursor-pointer p-0">
          <span class="label-text">{label}</span>
          <input
            bind:group={selectValue}
            type="radio"
            name="radio-10"
            hidden
            checked
            {value}
          />
        </label>
      </button>
    {/each}
  </ul>
</details>
