<script lang="ts">
	import axios from 'axios';
	import type { MouseEventHandler } from "svelte/elements";

  let username = 'kun@baskit.app';
  let password = '12345678';

  const onAuth:MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await axios.post('http://127.0.0.1');
    console.log({response});
  };
</script>

<div id="buyer-page">
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Username</span>
    </div>
    <input type="text" placeholder="username" value={username} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Password</span>
    </div>
    <input type="password" placeholder="password" value={password} class="input input-bordered w-full max-w-xs" />
  </label>
  <button class="btn" on:click={onAuth}>
    Auth
  </button>
</div>

<style>
  div#buyer-page {
    padding: 32px;
    height: 100%;
  }
</style>
