<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import { nonLowerCaseRegexp } from '../../consts/regexp';
  import Modal from '../Modal.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import type { Translation } from '@/types/translation';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import InputAutoComplete from '../atoms/InputAutoComplete.svelte';

  type Props = {
    client: AxiosInstance,
    langList?: string[],
    platformList?: string[],
    onsuccess?: (data: Translation) => void,
    dialog?: HTMLDialogElement,
  };

  let {
    client,
    langList = $bindable([]),
    platformList = $bindable([]),
    onsuccess,
    dialog = $bindable(),
  }:Props = $props();

  const data = $state({
    lang: '',
    platform: '',
    key: '',
    value: '',
  });

  $effect(() => {
    if (nonLowerCaseRegexp.test(data.lang)) {
      data.lang = data.lang.toLowerCase().replaceAll(nonLowerCaseRegexp, '');
    }
  });

  function onTranslationAdded(data: Translation) {
    if (onsuccess) {
      onsuccess(data);
    }
    dialog?.close();
  }
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <FormWrapper
      {client}
      path="/translation"
      payload={data}
      onsuccess={onTranslationAdded}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Language</span>
        </div>
        <InputAutoComplete
          maxlength={2}
          placeholder="language"
          bind:value={data.lang}
          suggestions={langList}
        />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Platform</span>
        </div>
        <InputAutoComplete
          placeholder="platform"
          bind:value={data.platform}
          suggestions={platformList}
        />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Key</span>
        </div>
        <input type="text" placeholder="key" bind:value={data.key} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Value</span>
        </div>
        <input type="text" placeholder="value" bind:value={data.value} class="input input-bordered w-full max-w-xs" />
      </label>
      <SubmitButton>
        Add
      </SubmitButton>
    </FormWrapper>
  </div>
</Modal>
