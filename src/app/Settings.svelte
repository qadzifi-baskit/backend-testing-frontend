<script lang="ts">
  import Modal from '@/components/Modal.svelte';
  import { Context } from '@/lib/helper/context';

  type Props = {
    dialog?: HTMLDialogElement,
  };
  let { dialog = $bindable() }: Props = $props();

  const {
    settings,
  } = Context.strict;

  $effect(() => {
    if (settings.defaultTab !== undefined) {
      localStorage.setItem('default-app', String(settings.defaultTab));
    }
  });
</script>

<Modal bind:dialog>
  <ul>
    {#each settings.tabs as tab, idx}
      <li class="not-last:mb-2">
        <label>
          <input type="radio" name="default-tab" class="radio"
            value={idx}
            bind:group={settings.defaultTab}
          >
          {tab.label}
        </label>
      </li>
    {/each}
  </ul>
</Modal>
