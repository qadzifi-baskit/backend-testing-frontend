<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Select from './Select.svelte';
  import { cn } from '@/lib/helper/tailwind';
  import { Icon } from 'svelte-icons-pack';
  import { BiReset } from 'svelte-icons-pack/bi';

  type Props = {
    open?: boolean,
    value?: Date|string|null,
    current?: Date,
    selectedYear?: number,
    selectedMonth?: number,
    selectedDate?: number|null,
    onselect?: (date: Date|null) => void,
  };
  let {
    open = $bindable(false),
    value = $bindable(null),
    current = $bindable(new Date()),
    selectedYear = $bindable(current.getFullYear()),
    selectedMonth = $bindable(current.getMonth() + 1),
    selectedDate = $bindable(current.getDate()),
    onselect,
  }: Props = $props();

  let dateValue = typeof value === 'string' ? new Date(value) : value;
  let selectedDateYear:number|null = $state(dateValue?.getFullYear() ?? null);
  let selectedDateMonth:number|null = $state(dateValue?.getMonth() ?? null);
  let startDate = $state(new Date(selectedYear, selectedMonth - 1, 1).getDay());
  let nextDate = $state(new Date(selectedYear, selectedMonth, 0));
  let monthInDay = $derived(nextDate.getDate());

  const dispatch = createEventDispatcher();

  const reselectMonth = () => {
    startDate = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    nextDate = new Date(selectedYear, selectedMonth, 0);
  };

  $effect(() => {
    selectedMonth;
    selectedYear;
    reselectMonth();
  });

  function reset() {
    selectedDateYear = null;
    selectedDateMonth = null;
    selectedDate = null;
    value = null;
  }

  const onSelectDate = (date: number) => () => {
    if (isSelected(date)) {
      reset();
    } else {
      selectedDateYear = selectedYear;
      selectedDateMonth = selectedMonth;
      selectedDate = date;
      value = new Date(selectedYear, selectedMonth - 1, date);
    }
    dispatch('select-date', value);
    if (onselect) {
      const payload = typeof value === 'string' ? new Date(value) : value;
      onselect(payload);
    }
  };

  function isSelected(date: number) {
    return selectedMonth === selectedDateMonth &&
      selectedYear === selectedDateYear &&
      date === selectedDate;
  }
</script>

<details bind:open={open} class="dropdown">
  <summary class="btn m-1">
    {
      typeof value === 'string' && value ||
        value instanceof Date && value.toISOString() ||
        'Select Date'
    }
  </summary>
  <div class="menu dropdown-content bg-base-100 rounded-box z-20 w-fit p-2 shadow-sm border border-slate-500">
    <div class="flex">
      <label class="form-control w-1/2 max-w-xs">
        <div class="label">
          <span class="label-text font-bold">Year</span>
        </div>
        <input type="number" placeholder="year" bind:value={selectedYear} class="input input-bordered w-full" />
      </label>
      <Select
        labelClass="font-bold"
        containerClass="w-1/2"
        bind:value={selectedMonth}
        title="Month"
        options={Array.from({length: 12}, (_, i) => [i+1, `${i+1}`])}
      />
    </div>
    <div class="p-2 rounded-lg grid grid-cols-7 w-max *:w-10 *:h-10">
      <div class="font-bold content-center text-center">Mon</div>
      <div class="font-bold content-center text-center">Tue</div>
      <div class="font-bold content-center text-center">Wed</div>
      <div class="font-bold content-center text-center">Thu</div>
      <div class="font-bold content-center text-center">Fri</div>
      <div class="font-bold content-center text-center">Sat</div>
      <div class="font-bold content-center text-center">Sun</div>
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each Array.from({length: startDate - 1}) as _}
        <div>&nbsp;</div>
      {/each}
      {#each Array.from({length: monthInDay}, (_, i) => i+1) as item}
        <button
          type="button"
          onclick={onSelectDate(item)}
          style="--border-width:{isSelected(item) ? '2px' : 0}"
          class={cn(
            'btn p-0 min-h-[auto] min-w-[auto] hover:btn-secondary date-button',
          )}
        >
          {item}
        </button>
      {/each}
    </div>
    <div class="mt-2">
      <button type="button" class="btn btn-secondary float-right"
        onclick={reset}
      >
        <Icon src={BiReset}/>
      </button>
    </div>
  </div>
</details>

<style>
  button.date-button {
    border-width: var(--border-width);
    border-color: white;
  }
</style>
