<script lang="ts">
  import { MemberDiscountLevelList } from '@/consts/memberDiscount';
  import type { MemberDiscountLevel } from '@/lib/enum/memberDiscount.enum';
  import type { MemberDiscount } from '@/types/inventory';

  type Props = {
    discountList: MemberDiscount[],
    inventoryId: string,
    onsave?: (data: MemberDiscount[]) => unknown,
  };
  let {
    discountList = $bindable([]),
    inventoryId,
    onsave,
  }:Props = $props();

  let discountSettings:MemberDiscount[] = $state([]);
  const discountStatus:Record<MemberDiscountLevel,boolean> = $state({
    SILVER: false,
    GOLD: false,
    PLATINUM: false,
  });

  $effect(() => {
    discountSettings = MemberDiscountLevelList.map(
      (level):MemberDiscount => {
        discountStatus[level] = false;
        const discount = discountList.find((item) => item.level === level);
        if (discount) {
          discountStatus[level] = true;
          return discount;
        }
        return {
          level,
          inventoryId,
          amount: 0,
        };
      },
    );
  });

  function saveDiscount() {
    if (onsave) {
      const payload = discountSettings.filter(
        (discount) => discountStatus[discount.level],
      );
      onsave(payload);
    }
  }
</script>

<div class="overflow-x-auto min-h-fit">
  <table class="table h-fit">
    <thead>
      <tr>
        <th>Level</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each discountSettings as discount}
        <tr>
          <td>{discount.level}</td>
          <td>
            <label class="form-control w-full max-w-xs mb-2">
              <input type="number" placeholder="amount" bind:value={discount.amount} class="input input-bordered w-full max-w-xs" />
            </label>
          </td>
          <td>
            <input
              type="checkbox"
              class="toggle toggle-success"
              bind:checked={discountStatus[discount.level]}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<button
  onclick={saveDiscount}
  class="btn bg-slate-600 mt-2"
>
  Save Member Discount
</button>
