<script lang="ts">
  export let value = 1;
  export let min = 1;
  export let max = 100;

  let selectJump = false;

  export let onGoBack:(value: number) => unknown = () => undefined;
  export let onGoForward:(value: number) => unknown = () => undefined;
  export let onGoToFirst:(value: number) => unknown = () => undefined;
  export let onGoToLast:(value: number) => unknown = () => undefined;

  const onCLickBack = () => {
    value = Math.max(min, value - 1);
    onGoBack(value);
  };

  const onCLickForward = () => {
    value = Math.min(max, value + 1);
    onGoForward(value);
  };

  const onClickFirst = () => {
    value = min;
    onGoToFirst(value);
  };

  const onClickLast = () => {
    value = max;
    onGoToLast(value);
  };

  const onSelectJump = () => {
    selectJump = true;
  };

  const onJump = () => {
    selectJump = false;
  };
</script>

<div id="pagination-button" class="join input-bordered border">
  <button class="join-item btn" on:click={onCLickBack}>«</button>
  {#if value - min > 1}
    <button class="join-item btn bg-neutral" on:click={onClickFirst}>{min}</button>
  {/if}
  {#if value - min > 2}
    <button class="join-item btn" disabled>...</button>
  {/if}
  {#if value > min}
    <button class="join-item btn bg-base-300" on:click={onCLickBack}>{value - 1}</button>
  {/if}
  {#if selectJump}
    <input type="number" placeholder="page" class="input" bind:value
      on:focusout={onJump}
    >
  {:else}
    <button class="join-item btn bg-base-100" on:click={onSelectJump}>{value}</button>
  {/if}
  {#if value < max}
    <button class="join-item btn bg-base-300" on:click={onCLickBack}>{value + 1}</button>
  {/if}
  {#if max - value > 2}
    <button class="join-item btn" disabled>...</button>
  {/if}
  {#if max - value > 1}
    <button class="join-item btn bg-neutral" on:click={onClickLast}>{max}</button>
  {/if}
  <button class="join-item btn" on:click={onCLickForward}>»</button>
</div>

<style>
  #pagination-button>* {
    width: 3em;
  }
</style>
