<script lang="ts">
  export let value = 1;
  export let min = 1;
  export let max = 100;
  export let dynamic = false;

  let selectJump = false;

  const onCLickBack = () => {
    value = Math.max(min, value - 1);
  };

  const onCLickForward = () => {
    value = Math.min(max, value + 1);
  };

  const onClickFirst = () => {
    value = min;
  };

  const onClickLast = () => {
    value = max;
  };

  const onSelectJump = () => {
    selectJump = true;
  };

  const onJump = () => {
    selectJump = false;
  };
</script>

<div id="pagination-button" class="join input-bordered border">
  <button class="join-item btn" on:click={onCLickBack}>‹</button>
  {#if !dynamic || value - min > 1}
    <button class="join-item btn bg-neutral" on:click={onClickFirst}>
      {dynamic ? min : '«'}
    </button>
  {/if}
  {#if dynamic}
    {#if value - min > 2}
      <button class="join-item btn" disabled>
        ...
      </button>
    {/if}
  {:else if max > 2 && value === max}
    <button class="join-item btn">
      {value - 2}
    </button>
  {/if}
  {#if value > min}
    <button class="join-item btn bg-base-300" on:click={onCLickBack}>{value - 1}</button>
  {/if}
  {#if selectJump}
    <input type="number" placeholder="page" class="input" bind:value
      on:focusout={onJump}
    >
  {:else}
    <button class="join-item btn font-bold underline underline-offset-4 bg-base-100" on:click={onSelectJump}>{value}</button>
  {/if}
  {#if value < max}
    <button class="join-item btn bg-base-300" on:click={onCLickBack}>{value + 1}</button>
  {/if}
  {#if dynamic}
    {#if max - value > 2}
      <button class="join-item btn" disabled>
        ...
      </button>
    {/if}
  {:else if max > 2 && value === min}
    <button class="join-item btn">
      {value + 2}
    </button>
  {/if}
  {#if !dynamic || max - value > 1}
    <button class="join-item btn bg-neutral" on:click={onClickLast}>
      {dynamic ? max : '»'}
    </button>
  {/if}
  <button class="join-item btn" on:click={onCLickForward}>›</button>
</div>

<style>
  #pagination-button>* {
    width: 3em;
  }
</style>
