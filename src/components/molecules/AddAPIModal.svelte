<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';

  export let client:AxiosInstance;
  export let dialog:HTMLDialogElement|undefined;

  const payload = {
    apiName: '',
    apiGroup: '',
    endpoint: '',
  };

  const createApi = async () => {
    const response = await client.post(
      '/api',
      payload,
    );
    if (response.status !== 200) {
      return;
    }
    dialog?.close();
  };
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">API Name</span>
      </div>
      <input type="text" placeholder="api name" bind:value={payload.apiName} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">API Group</span>
      </div>
      <input type="text" placeholder="api group" bind:value={payload.apiGroup} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Endpoint</span>
      </div>
      <input type="text" placeholder="group" bind:value={payload.endpoint} class="input input-bordered w-full max-w-xs" />
    </label>
    <div class="label"></div>
    <button
      class="btn bg-slate-600"
      on:click={createApi}
    >
      Create
    </button>
  </div>
</Modal>
