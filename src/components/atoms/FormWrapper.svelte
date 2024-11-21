<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';

  type Props = {
    client: AxiosInstance,
    payload: unknown,
    path: string,
    children: Snippet,
  };
  let {
    client,
    payload,
    path,
    children,
  }:Props = $props();

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    const response = await client.post(
      path,
      payload,
    );
    if (response.status !== 200) return;
  }
</script>

<form {onsubmit}>
  {@render children()}
</form>
