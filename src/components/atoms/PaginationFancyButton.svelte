<script lang="ts">
  type Props = {
    value?: number,
    limit?: number,
    min?: number,
    max?: number,
    dynamic?: boolean,
  };

  let {
    value = $bindable(1),
    limit = $bindable(10),
    min = $bindable(1),
    max = $bindable(100),
    dynamic = $bindable(false),
  }:Props = $props();

  let selectJump = $state(false);

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

  $effect(() => {
    limit;
    value = min;
  });
</script>

<div id="pagination-button" class="join input-bordered border">
  <button class="join-item btn" onclick={onCLickBack}>‹</button>
  {#if !dynamic || value - min > 1}
    <button class="join-item btn bg-neutral" onclick={onClickFirst}>
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
    <button class="join-item btn bg-base-300" onclick={onCLickBack}>{value - 1}</button>
  {/if}
  {#if selectJump}
    <input type="number" placeholder="page" class="input" bind:value
      onfocusout={onJump}
    >
  {:else}
    <button class="join-item btn font-bold underline underline-offset-4 bg-base-100" onclick={onSelectJump}>{value}</button>
  {/if}
  {#if value < max}
    <button class="join-item btn bg-base-300" onclick={onCLickBack}>{value + 1}</button>
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
    <button class="join-item btn bg-neutral" onclick={onClickLast}>
      {dynamic ? max : '»'}
    </button>
  {/if}
  <button class="join-item btn" onclick={onCLickForward}>›</button>
</div>
<div class="my-2">
  <label>
    <input type="range" min="1" max="100" bind:value={limit} class="range">
    <span>{limit}</span>
  </label>
</div>

<style>
  #pagination-button>* {
    width: 3em;
  }
</style>
