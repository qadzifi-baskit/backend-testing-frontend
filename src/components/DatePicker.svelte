<script>
</script>

<details class="dropdown">
  <summary class="btn m-1">Select Date</summary>
  <div class="menu dropdown-content bg-base-100 rounded-box z-[1] w-max p-2 shadow border border-slate-500">
    <div class="p-2 rounded-lg grid grid-cols-7 w-fit">
      {#each Array.from({length: 30}, (_, i) => i+1) as item}
        <button class="btn w-8 h-8 p-0 min-h-[auto] min-w-[auto] border-0 hover:bg-slate-600" disabled>{item}</button>
      {/each}
    </div>
  </div>
</details>
