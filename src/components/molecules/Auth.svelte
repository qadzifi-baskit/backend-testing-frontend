<script lang="ts">
  import { dispatchAuthSuccess, dispatchDoAuth } from '@/event';
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { EventHandler } from 'svelte/elements';
  import type { Writable } from 'svelte/store';
  import Collapse from '../Collapse.svelte';

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

  let auth = $state({
    'X-ID': '',
    Authorization: '',
  });

  const doAuth:EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
    e.preventDefault();
    store?.update((value) => ({
      ...value,
      loggedIn: false,
    }));
    authStatus = AuthStatusEnum.IDLE;
    client.defaults.headers.common = {};
    clearTimeout(authTimeout);
    dispatchDoAuth();
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      store?.update((value) => ({
        ...value,
        userId: response.data?.data?.id ?? '',
        loggedIn: true,
      }));

      showSuccess();

      auth = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      client.defaults.headers.common = auth;
      dispatchAuthSuccess(auth);
    }
  };
</script>

<Collapse title="Auth">
  <form onsubmit={doAuth}>
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
      <button class="btn bg-slate-600" type="submit">Auth</button>
      {#if authStatus === AuthStatusEnum.SUCCESS}
        <span class="text-lime-400">Login Success</span>
      {/if}
    </div>
  </form>
</Collapse>
