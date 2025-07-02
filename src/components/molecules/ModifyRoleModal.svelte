<script lang="ts">
  import Modal from '../Modal.svelte';
  import AclManagement from './ACLManagement.svelte';

  type Props = {
    dialog?: HTMLDialogElement;
    title?: string;
    roleid?: string,
    show?: boolean,
  };
  let {
    dialog = $bindable(),
    title = $bindable('Role Detail'),
    roleid = $bindable(),
    show = $bindable(),
  }: Props = $props();
</script>

<Modal bind:dialog bind:title>
  <AclManagement bind:show bind:roleid/>
</Modal>
