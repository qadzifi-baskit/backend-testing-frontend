<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import Collapse from '../Collapse.svelte';
  import { dispatchAuthSuccess, dispatchDoAuth } from '@/event';
  import type { AxiosInstance } from 'axios';
  import type { AuthStore } from '@/types';
  import type { Writable } from 'svelte/store';

  const AuthStatusEnum = {
    IDLE: 'IDLE',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
  } as const;
  type AuthStatusEnum =
    (typeof AuthStatusEnum)[keyof typeof AuthStatusEnum];

  type Props = {
    username: string,
    password: string,
    client: AxiosInstance,
    store?: Writable<AuthStore>,
  };

  let {
    username = $bindable(),
    password = $bindable(),
    client,
    store,
  }:Props = $props();

  let authStatus:AuthStatusEnum = $state(AuthStatusEnum.IDLE);
  let authTimeout:ReturnType<typeof setTimeout>|undefined = $state();

  function showSuccess() {
    authStatus = AuthStatusEnum.SUCCESS;
    if (authTimeout) {
      clearTimeout(authTimeout);
    }
    authTimeout = setTimeout(
      () => authStatus = AuthStatusEnum.IDLE,
      1500,
    );
  }

  const doAuth:MouseEventHandler<HTMLButtonElement> = async () => {
    authStatus = AuthStatusEnum.IDLE;
    clearTimeout(authTimeout);
    dispatchDoAuth();
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      store?.update((value) => ({
        ...value,
        loggedIn: true,
      }));

      showSuccess();

      const auth = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      client.defaults.headers.common = auth;
      dispatchAuthSuccess(auth);
    }
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
  <div class="label"></div>
  <div>
    <button class="btn bg-slate-600" onclick={doAuth}>Auth</button>
    {#if authStatus === AuthStatusEnum.SUCCESS}
      <span class="text-lime-400">Login Success</span>
    {/if}
  </div>
</Collapse>
