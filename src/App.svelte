<script>
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidAngleRight } from 'svelte-icons-pack/fa';
  import BaskitAdmin from './app/baskit-admin/BaskitAdmin.svelte';
  import BrandUser from './app/brand-user/BrandUser.svelte';
  import Buyer from './app/buyer';
  import Seller from './app/seller';
  import SuperAdmin from './app/super-admin/SuperAdmin.svelte';
  import Config from './components/molecules/Config.svelte';
  let selected = 1;
  let host = import.meta.env.VITE_API_HOST;

  const tabs = [
    { label: 'Buyer', component: Buyer },
    { label: 'Seller', component: Seller },
    { label: 'Baskit Admin', component: BaskitAdmin },
    { label: 'Brand User', component: BrandUser },
    { label: 'Super Admin', component: SuperAdmin },
  ];
</script>

<Config
  bind:host
  showClient={false}
/>
<div style="--amount:{tabs.length}" role="tablist" class="tabs tabs-bordered w-full">
  {#each tabs as { component: Component }, index }
    <input checked={selected === index + 1} type="radio" name="my_tabs_1" role="tab" class="tab hidden" aria-label={`Tab ${index + 1}`}/>
    <div role="tabpanel" class="tab-content">
      <Component bind:host/>
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
        <li><button class="btn" on:click={() => selected = index + 1}>{label}</button></li>
      {/each}
    </ul>
  </div>
</div>

<style lang="">
  div.tabs {
    grid-template-columns: repeat(var(--amount), 1fr);
  }
</style>
