<script lang="ts">
  export let value = 1;
  export let min = 1;
  export let max = 100;

  export let onGoBack:(value: number) => unknown = () => undefined;
  export let onGoForward:(value: number) => unknown = () => undefined;

  const onCLickBack = async () => {
    value = Math.max(min, value - 1);
    onGoBack(value);
  };

  const onCLickForward = async () => {
    value = Math.min(max, value + 1);
    onGoForward(value);
  };
</script>

<div id="pagination-button" class="join input-bordered border my-4">
  <button class="join-item btn" on:click={onCLickBack}>«</button>
  <input type="number" placeholder="page" class="input w-full max-w-xs" bind:value>
  <button class="join-item btn" on:click={onCLickForward}>»</button>
</div>

<style></style>
