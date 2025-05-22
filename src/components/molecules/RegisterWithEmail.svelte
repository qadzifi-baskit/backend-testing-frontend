<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  const payload = $state({
    email: '',
    password: '',
  });
</script>

<FormWrapper
  {client}
  {payload}
  path="/auth/register"
>
  <FormInput label="E-Mail" placeholder="e-mail" bind:value={payload.email}/>
  <FormInput label="Password" placeholder="password" type="password" bind:value={payload.password}/>
  <SubmitButton/>
</FormWrapper>
