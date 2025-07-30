<script lang="ts">
  import '@andypf/json-viewer';
  import Modal from '../Modal.svelte';
  import type { AxiosInstance } from 'axios';
  import { FaSolidRotate } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    dialog = $bindable(),
  }: Props = $props();

  let translationObjectList:[string, object][] = $state([]);
  async function getTranslationObjectList() {
    const langResponse = await client.get('/translation/lang');
    if (langResponse.status !== 200) return;
    const langList:string[] = langResponse.data?.data ?? [];
    translationObjectList = await Promise.all(
      langList.map(async (lang) => {
        const response = await client.get(`/translation/lang/${lang}`);
        return [lang, response.data ?? {}];
      }),
    );
  }
</script>

<Modal
  bind:dialog
  onopen={getTranslationObjectList}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <button
      onclick={getTranslationObjectList}
      class="btn btn-secondary"
    >
      <Icon src={FaSolidRotate}/>
    </button>
    <div role="tablist" class="tabs tabs-bordered">
      {#each translationObjectList as [lang, translation], idx}
        <input
          type="radio"
          name="view_tab"
          role="tab"
          class="tab"
          aria-label={lang.toUpperCase()}
          checked={idx === 0}
        />
        <div role="tabpanel" class="tab-content p-2">
          <andypf-json-viewer data={JSON.stringify(translation)} theme="monokai"
            expanded
          >
          </andypf-json-viewer>
        </div>
      {/each}
    </div>
  </div>
</Modal>
