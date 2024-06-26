<script>
    import { FaSolidBars } from 'svelte-icons-pack/fa';
    import { Icon } from 'svelte-icons-pack';
    import Buyer from './app/buyer';
    import Seller from './app/seller';
    const amount = 4;
    let selected = 1;
</script>
<div style="--amount:{amount}" role="tablist" class="tabs tabs-bordered w-full">
  <input checked={selected === 1} type="radio" name="my_tabs_1" role="tab" class="tab hidden" aria-label="Tab 1" />
  <div role="tabpanel" class="tab-content"><Buyer/></div>

  <input checked={selected === 2} type="radio" name="my_tabs_1" role="tab" class="tab hidden" aria-label="Tab 2" />
  <div role="tabpanel" class="tab-content"><Seller/></div>
</div>
<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content fixed bottom-8 left-8">
    <!-- Page content here -->
    <label for="my-drawer" class="btn btn-primary drawer-button">
      <Icon src={FaSolidBars} className="text-xl"/>
    </label>
  </div> 
  <div class="drawer-side z-10">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <li><button class="btn" on:click={() => selected = 1}>Buyer</button></li>
      <li><button class="btn" on:click={() => selected = 2}>Seller</button></li>
    </ul>
  </div>
</div>

<style lang="">
  div.tabs {
    grid-template-columns: repeat(var(--amount), 1fr);
  }
</style>
