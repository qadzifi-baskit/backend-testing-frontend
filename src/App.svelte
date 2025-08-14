<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { BiError } from 'svelte-icons-pack/bi';
  import { FaSolidAngleLeft, FaSolidAngleRight, FaSolidGear } from 'svelte-icons-pack/fa';
  import { VscOpenPreview } from 'svelte-icons-pack/vsc';
  import BaskitAdmin from './app/baskit-admin/BaskitAdmin.svelte';
  import BaskitSuperCompany from './app/baskit-super-company/BaskitSuperCompany.svelte';
  import BrandUser from './app/brand-user/BrandUser.svelte';
  import Buyer from './app/Buyer';
  import ErrorManager from './app/ErrorManager.svelte';
  import GrosirSeller from './app/grosir-seller';
  import Seller from './app/seller';
  import Settings from './app/Settings.svelte';
  import SuperAdmin from './app/super-admin/SuperAdmin.svelte';
  import FloatingBadge from './components/atoms/FloatingBadge.svelte';
  import Config from './components/molecules/Config.svelte';
  import ResourceViewerModal from './components/molecules/ResourceViewerModal.svelte';
  import { apiEnv } from './lib/config/env.svelte';
  import { Context } from './lib/helper/context';
  import { clamp } from './lib/helper/math';
  import { cn } from './lib/helper/tailwind';
  import type { AppSettings, AppTabs } from './types/app';
  import type { GlobalConfig } from './types/config';

  const config:GlobalConfig = $state({
    host: apiEnv.DEFAULT_API_HOST,
  });
  const settings = $state<AppSettings>({ tabs: [] });
  Context.set('config', config);
  Context.set('settings', settings);

  const tabs:AppTabs[] = [
    { label: 'Buyer', component: Buyer },
    { label: 'Seller', component: Seller },
    { label: 'Grosir Seller', component: GrosirSeller },
    { label: 'Baskit Admin', component: BaskitAdmin },
    { label: 'Brand User', component: BrandUser },
    { label: 'Super Admin', component: SuperAdmin },
    { label: 'Baskit Super Company', component: BaskitSuperCompany },
  ];
  settings.tabs = tabs;

  const DEFAULT_APP = clamp(apiEnv.DEFAULT_APP ?? 0, 0, tabs.length - 1);
  settings.defaultTab = Number(localStorage.getItem('default-app') ?? DEFAULT_APP);

  let selected = $state(
    !import.meta.env.PROD ? settings.defaultTab : DEFAULT_APP,
  );

  let errorModal = $state<HTMLDialogElement>();
  let resourceModal = $state<HTMLDialogElement>();
  let settingsModal = $state<HTMLDialogElement>();
</script>

<ErrorManager bind:dialog={errorModal}/>
<Settings bind:dialog={settingsModal}/>
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
    <button class="btn btn-info fixed bottom-32 right-8 z-10" onclick={() => settingsModal?.showModal()}>
      <Icon src={FaSolidGear}/>
    </button>
  </div>
</div>
<FloatingBadge class="fixed right-4 top-4">{tabs[selected].label}</FloatingBadge>

<style>
  div.tabs {
    grid-template-columns: repeat(var(--amount), 1fr);
  }
</style>
