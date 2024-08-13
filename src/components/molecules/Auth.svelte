<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import Collapse from '../Collapse.svelte';
  import { onDoAuthEvent } from '@/event';

  export let username:string;
  export let password:string;
  export let onAuth:MouseEventHandler<HTMLButtonElement> = () => undefined;

  const onDoAuth:MouseEventHandler<HTMLButtonElement> = (e) => {
    dispatchEvent(onDoAuthEvent);
    onAuth(e);
  };
</script>

<Collapse title="Auth">
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Username</span>
    </div>
    <input type="text" placeholder="username" bind:value={username} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Password</span>
    </div>
    <input type="password" placeholder="password" bind:value={password} class="input input-bordered w-full max-w-xs" />
  </label>
  <div>
    <button class="btn bg-slate-600" on:click={onDoAuth}>Auth</button>
  </div>
</Collapse>
