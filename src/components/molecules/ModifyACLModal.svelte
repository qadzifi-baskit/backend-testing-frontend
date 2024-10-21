<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';

  export let id:string;
  export let client:AxiosInstance;
  export let dialog:HTMLDialogElement|undefined;

  const updateACL = async () => {
    const response = await client.patch(
      `/acls/${id}`
    );
  };
</script>

<Modal
  bind:dialog
>
</Modal>
