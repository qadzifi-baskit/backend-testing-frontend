<script lang="ts">
  import type { PriceTier } from '@/types';

  type Props = {
    tierList: PriceTier[],
    tierMin?: number,
    tierMax?: number,
    onsave?: (data: PriceTier[]) => unknown,
  };
  let {
    tierList = $bindable([]),
    tierMin = 1,
    tierMax = 4,
    onsave,
  }:Props = $props();

  let tierSettings:PriceTier[] = $state([]);
  const tierStatus:Record<number, boolean> = $state({});

  $effect(() => {
    tierSettings = Array.from(
      { length: tierMax - tierMin + 1 },
      (_, i):PriceTier => {
        const tierNo = i + tierMin;
        tierStatus[tierNo] = false;
        const tier = tierList.find((item) => item.tierNo === tierNo);
        if (tier) {
          tierStatus[tierNo] = true;
          return tier;
        };
        return {
          id: '',
          tierNo,
          sellingPrice: 0,
          margin: 0,
          min: 0,
          max: 0,
        };
      },
    );
  });

  function savePriceTier() {
    if (onsave) {
      const payload = tierSettings.filter(
        (tier) => tierStatus[tier.tierNo],
      );
      onsave(payload);
    }
  }
</script>

<div class="overflow-x-auto min-h-fit">
  <table class="table h-fit">
    <thead>
      <tr>
        <th>Tier No</th>
        <th>Min</th>
        <th>Max</th>
        <th>Price</th>
        <th>Margin</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each tierSettings as tier}
        <tr>
          <td>{tier.tierNo}</td>
          <td>
            <label class="form-control w-full max-w-xs mb-2">
              <input type="number" placeholder="min" bind:value={tier.min} class="input input-bordered w-full max-w-xs" />
            </label>
          </td>
          <td>
            <label class="form-control w-full max-w-xs mb-2">
              <input type="number" placeholder="max" bind:value={tier.max} class="input input-bordered w-full max-w-xs" />
            </label>
          </td>
          <td>
            <label class="form-control w-full max-w-xs mb-2">
              <input type="number" placeholder="price" bind:value={tier.sellingPrice} class="input input-bordered w-full max-w-xs" />
            </label>
          </td>
          <td>
            <label class="form-control w-full max-w-xs mb-2">
              <input type="number" placeholder="margin" bind:value={tier.margin} class="input input-bordered w-full max-w-xs" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              class="toggle toggle-success"
              bind:checked={tierStatus[tier.tierNo]}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<button
  onclick={savePriceTier}
  class="btn bg-slate-600 mt-2"
>
  Save Tier
</button>
