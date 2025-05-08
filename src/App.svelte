<script lang="ts">
  import type { Component } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { BiError } from 'svelte-icons-pack/bi';
  import { FaSolidAngleRight } from 'svelte-icons-pack/fa';
  import { VscOpenPreview } from 'svelte-icons-pack/vsc';
  import BaskitAdmin from './app/baskit-admin/BaskitAdmin.svelte';
  import BrandUser from './app/brand-user/BrandUser.svelte';
  import Buyer from './app/Buyer';
  import GrosirSeller from './app/grosir-seller';
  import Seller from './app/seller';
  import SuperAdmin from './app/super-admin/SuperAdmin.svelte';
  import Config from './components/molecules/Config.svelte';
  import ErrorManagerModal from './components/molecules/ErrorManagerModal.svelte';
  import ResourceViewerModal from './components/molecules/ResourceViewerModal.svelte';
  import { apiEnv } from './lib/config/env.svelte';
  import { cn } from './lib/helper/tailwind';
  import type { AppConfig } from './types/app';
  let selected = $state(apiEnv.DEFAULT_APP);
  let host = $state(apiEnv.DEFAULT_API_HOST);

  type PageComponent = Component<{ host: string, config: AppConfig }>;
  const tabs:{ label: string, component: PageComponent }[] = [
    { label: 'Buyer', component: Buyer },
    { label: 'Seller', component: Seller },
    { label: 'Grosir Seller', component: GrosirSeller },
    { label: 'Baskit Admin', component: BaskitAdmin },
    { label: 'Brand User', component: BrandUser },
    { label: 'Super Admin', component: SuperAdmin },
  ];

  let errorModal = $state<HTMLDialogElement>();
  let resourceModal = $state<HTMLDialogElement>();
</script>

<ErrorManagerModal bind:dialog={errorModal}/>
<ResourceViewerModal bind:dialog={resourceModal}/>
<Config
  bind:host
  show='host'
/>
<div style="--amount:{tabs.length}" role="tablist" class="tabs tabs-bordered w-full">
  {#each tabs as { component: Component }, index }
    <input checked={selected === index} type="radio" name="app-tab" role="tab" class="tab hidden" aria-label={`Tab ${index + 1}`}/>
    <div role="tabpanel" class="tab-content">
      <Component bind:host config='client'/>
    </div>
  {/each}
</div>
<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content fixed bottom-8 left-0 z-10">
    <!-- Page content here -->
    <label for="my-drawer" class="btn btn-primary drawer-button p-0 rounded-l-none">
      <Icon src={FaSolidAngleRight} className="text-xl"/>
    </label>
  </div> 
  <div class="drawer-side z-10">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      {#each tabs as { label }, index }
        <li>
          <button
            class={cn(
              'btn',
              {
                'bg-slate-800': selected === index,
              },
            )}
            onclick={() => selected = index}
          >
            {label}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>
<button class="btn btn-error fixed bottom-8 right-8 z-10" onclick={() => errorModal?.showModal()}>
  <Icon src={BiError}/>
</button>
<button class="btn btn-info fixed bottom-20 right-8 z-10" onclick={() => resourceModal?.showModal()}>
  <Icon src={VscOpenPreview}/>
</button>

<style lang="">
  div.tabs {
    grid-template-columns: repeat(var(--amount), 1fr);
  }
</style>
