<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Select from './Select.svelte';

  export let open = false;
  export let selectedDateValue:Date = new Date();
  export let current = new Date();
  export let selectedYear = current.getFullYear();
  export let selectedMonth = current.getMonth() + 1;
  export let selectedDate = selectedDateValue.getDate();
  let selectedDateYear = selectedYear;
  let selectedDateMonth = selectedMonth;
  let startDate = new Date(selectedYear, selectedMonth - 1, 1).getDay();
  let nextDate = new Date(selectedYear, selectedMonth, 0);
  let monthInDay = nextDate.getDate();

  const dispatch = createEventDispatcher();

  const reselectMonth = () => {
    startDate = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    nextDate = new Date(selectedYear, selectedMonth, 0);
    monthInDay = nextDate.getDate();
  };

  $: {
    selectedMonth;
    selectedYear;
    reselectMonth();
  }

  $: {
    selectedDateValue.setFullYear(selectedDateYear);
    selectedDateValue.setMonth(selectedDateMonth);
    selectedDateValue.setDate(selectedDate);
    dispatch('select-date', selectedDateValue);
  }

  const onSelectDate = (date: number) => () => {
    selectedDateYear = selectedYear;
    selectedDateMonth = selectedMonth;
    selectedDate = date;
  };
</script>

<details bind:open={open} class="dropdown">
  <summary class="btn m-1">Select Date</summary>
  <div class="menu dropdown-content bg-base-100 rounded-box z-20 w-fit p-2 shadow border border-slate-500">
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
    <div class="p-2 rounded-lg grid grid-cols-7 w-max [&>*]:w-10 [&>*]:h-10">
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
          on:click={onSelectDate(item)}
          style="--border-width:{
            selectedMonth === selectedDateMonth &&
              selectedYear === selectedDateYear &&
              item === selectedDate ? '2px' : 0
          }"
          class="btn p-0 min-h-[auto] min-w-[auto] hover:bg-slate-600 date-button"
        >
          {item}
        </button>
      {/each}
    </div>
  </div>
</details>

<style>
  button.date-button {
    border-width: var(--border-width);
    border-color: white;
  }
</style>
