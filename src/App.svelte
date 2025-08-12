<script lang="ts">
  import type { Component } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { BiError } from 'svelte-icons-pack/bi';
  import { FaSolidAngleLeft, FaSolidAngleRight } from 'svelte-icons-pack/fa';
  import { VscOpenPreview } from 'svelte-icons-pack/vsc';
  import BaskitAdmin from './app/baskit-admin/BaskitAdmin.svelte';
  import BaskitSuperCompany from './app/baskit-super-company/BaskitSuperCompany.svelte';
  import BrandUser from './app/brand-user/BrandUser.svelte';
  import Buyer from './app/Buyer';
  import GrosirSeller from './app/grosir-seller';
  import Seller from './app/seller';
  import SuperAdmin from './app/super-admin/SuperAdmin.svelte';
  import FloatingBadge from './components/atoms/FloatingBadge.svelte';
  import Config from './components/molecules/Config.svelte';
  import ErrorManagerModal from './components/molecules/ErrorManagerModal.svelte';
  import ResourceViewerModal from './components/molecules/ResourceViewerModal.svelte';
  import { apiEnv } from './lib/config/env.svelte';
  import { Context } from './lib/helper/context';
  import { clamp } from './lib/helper/math';
  import { cn } from './lib/helper/tailwind';
  import type { GlobalConfig } from './types/config';
  import type { AppConfig } from './types/app';

  const config:GlobalConfig = $state({
    host: apiEnv.DEFAULT_API_HOST,
  });
  Context.set('config', config);

  const DEFAULT = !import.meta.env.PROD;

  const tabs:{ label: string, component: Component<{ config: AppConfig }>, DEFAULT?: boolean }[] = [
    { label: 'Buyer', component: Buyer },
    { label: 'Seller', component: Seller, DEFAULT },
    { label: 'Grosir Seller', component: GrosirSeller },
    { label: 'Baskit Admin', component: BaskitAdmin },
    { label: 'Brand User', component: BrandUser },
    { label: 'Super Admin', component: SuperAdmin },
    { label: 'Baskit Super Company', component: BaskitSuperCompany },
  ];

  const DEFAULT_APP = clamp(apiEnv.DEFAULT_APP ?? 0, 0, tabs.length - 1);
  let selected = $state(DEFAULT ? Math.max(0, tabs.findIndex((tab) => tab.DEFAULT)) : DEFAULT_APP);

  let errorModal = $state<HTMLDialogElement>();
  let resourceModal = $state<HTMLDialogElement>();
</script>

<ErrorManagerModal bind:dialog={errorModal}/>
<ResourceViewerModal bind:dialog={resourceModal}/>
<Config show='host'/>
<div style="--amount:{tabs.length}" role="tablist" class="tabs tabs-bordered w-full">
  {#each tabs as { component: Component }, index }
    <input checked={selected === index} type="radio" name="app-tab" role="tab" class="tab hidden" aria-label={`Tab ${index + 1}`}/>
    <div role="tabpanel" class="tab-content">
      <Component config='client'/>
    </div>
  {/each}
</div>
<div class="drawer">
  <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content fixed bottom-8 left-0 z-10">
    <!-- Page content here -->
    <label for="menu-drawer" class="btn btn-primary drawer-button p-0 rounded-l-none">
      <Icon src={FaSolidAngleRight} className="text-xl"/>
    </label>
  </div> 
  <div class="drawer-side z-10">
    <label for="menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
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
<div class="drawer drawer-right">
  <input id="resource-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content fixed bottom-8 right-0 z-10">
    <!-- Page content here -->
    <label for="resource-drawer" class="btn btn-primary drawer-button p-0 rounded-r-none">
      <Icon src={FaSolidAngleLeft} className="text-xl"/>
    </label>
  </div> 
  <div class="drawer-side z-10 w-fit">
    <button class="btn btn-error fixed bottom-8 right-8 z-10" onclick={() => errorModal?.showModal()}>
      <Icon src={BiError}/>
    </button>
    <button class="btn btn-info fixed bottom-20 right-8 z-10" onclick={() => resourceModal?.showModal()}>
      <Icon src={VscOpenPreview}/>
    </button>
  </div>
</div>
<FloatingBadge class="fixed right-4 top-4">{tabs[selected].label}</FloatingBadge>

<style>
  div.tabs {
    grid-template-columns: repeat(var(--amount), 1fr);
  }
</style>
