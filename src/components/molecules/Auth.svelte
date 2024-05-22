<script lang="ts">
  export let username:string;
  export let password:string;
  export let onAuth = () => {};
</script>

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
  <button class="btn bg-slate-600" on:click={onAuth}>Auth</button>
</div>