<script lang="ts">
  import { DeliveryTypeEnum, OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore, PaymentType, WarehouseDetail } from '@/types';
  import type { Cart } from '@/types/cart';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import CartDraftDetail from './CartDraftDetail.svelte';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    userId?: string,
    cartCode?: string,
    companyId?: string,
    orderType?: OrderTypeEnum,
    clientType?: string,
    memberLevel?: string|null,
    show?: boolean,
    draft?: boolean,
    onOrderCreated?: () => unknown,
  };
  let {
    client,
    store,
    userId = $bindable(),
    cartCode = $bindable(),
    companyId = $bindable(),
    orderType = OrderTypeEnum.SHOP,
    memberLevel = $bindable(null),
    show,
    draft,
    onOrderCreated = () => null,
  }:Props = $props();

  const orderContext = Context.get('order');
  const cartQtyMap:Record<string, number> = {};
  let paymentTypeList:PaymentType[] = $state([]);
  let cartList:Cart[] = $state([]);
  let paymentTypeId = $state('');
  let subTotal = $state(0);
  let totalTierPrice = $state(0);
  let total = $state(0);
  let deliveryType:DeliveryTypeEnum = $state(DeliveryTypeEnum.SELLER_DELIVERY);

  const createOrder = async () => {
    if (!$store || !$store.loggedIn) return;
    stringToast('Creating order...');
    const response = await client.post('/order', {
      paymentTypeId,
      deliveryType,
      cartCode,
      orderType,
      product: cartList.map((value) => ({
        cartId: value.id,
        inventoryId: value.inventoryId,
        productId: value.productId,
        qty: value.qty,
        price: value.sellingPrice,
        companyId: value.companyId,
        memberLevel: value.memberLevel,
        memberDiscountAmount: value.memberDiscountAmount,
      })),
      userId,
    });
    if (response.status !== 200) return stringToast('Failed to create order');
    onOrderCreated();
    return stringToast('Order created');
  };

  async function getCart() {
    if (!$store || !$store.loggedIn) return;
    stringToast('Loading cart...');
    const params = new URLSearchParams({
      orderType,
    });
    if ($store.userId) {
      params.append('createdBy', $store.userId);
    }
    if (cartCode) {
      params.append('cartCode', cartCode);
    }
    const response = await client.get('/order', { params });
    if (response.status !== 200) return;
    const cartOrderList:{
      subTotal: number,
      totalTierPrice: number,
      total: number,
      wareHouse: WarehouseDetail,
      product: Cart[],
    }[] = response.data.data;
    [subTotal, totalTierPrice, total, cartList] = cartOrderList.reduce(
      (prev, curr): [number, number, number, Cart[]] => [
        prev[0] + curr.subTotal,
        prev[1] + curr.totalTierPrice,
        prev[2] + curr.total,
        [
          ...prev[3], ...(curr.product.map(
            (cart) => ({
              ...cart,
              warehouse: curr.wareHouse.name,
            }),
          )),
        ],
      ],
      <[number, number, number, Cart[]]>[0, 0, 0, []],
    );
    stringToast('Cart loaded');
  };

  const updateCartQty = async (cartId: string, qty: number) => {
    if (!store || $store?.loggedIn === false) return;
    stringToast('Updating cart...');
    const response = await client.patch(`/cart/${cartId}`, {
      qty,
    });
    if (response.status !== 200) return stringToast('Failed to update cart');
    for (const key in cartQtyMap) {
      delete cartQtyMap[key];
    }
    stringToast('Cart updated');
    getCart();
  };

  const updateCartMemberLevel = async () => {
    if (!$store || !$store.loggedIn) return;
    const params = new URLSearchParams();
    params.append('createdBy', $store.userId);
    const response = await client.patch('/cart', {
      memberLevel,
    }, { params });
    if (response.status !== 200) return;
    getCart();
  };

  $effect(() => {
    memberLevel;
    updateCartMemberLevel();
  });

  let saveDraftDialog:HTMLDialogElement|undefined = $state();
  async function saveCart() {
    saveDraftDialog?.showModal();
  }
  async function saveCartSuccess() {
    saveDraftDialog?.close();
    getCart();
  }

  $effect(() => {
    if (show) {
      getCart();
    }
  });

  if (orderContext) {
    orderContext.subscribe((value) => {
      paymentTypeList = value.paymentTypeList ?? [];
    });
  }
</script>

{#if !draft}
  <CartDraftDetail
    {client}
    bind:dialog={saveDraftDialog}
    bind:companyId
    ondelete={saveCartSuccess}
  />
{/if}
<Collapse class="overflow-auto" title="Order Summary" bind:show>
  {#snippet content(children?: Snippet)}
    <div class="collapse-content overflow-x-auto *:mb-2">
      {@render children?.()}
    </div>
  {/snippet}
  <button class="btn" onclick={getCart}>Get Cart</button>
  <Table5
    itemList={cartList}
  >
    {#snippet header()}
      <th>
        Qty
      </th>
      <th></th>
      <th></th>
      <th>Initial Price</th>
      <th>Tier Price</th>
      <th>Selling Price</th>
      <th>
        Warehouse
      </th>
      <th>
        Name
      </th>
    {/snippet}

    {#snippet content(cart: Cart)}
      <td>
        <input type="number" value={cart.qty} class="input input-bordered w-24 max-w-xs"
          onchange={(e) => { cartQtyMap[cart.id] = Number(e.currentTarget.value) }}
        >
      </td>
      <td>
        <button
          onclick={() => updateCartQty(cart.id, cartQtyMap[cart.id])}
          class="btn btn-secondary"
        >
          <Icon src={FaFloppyDisk}/>
        </button>
      </td>
      <td>
        <button
          onclick={() => updateCartQty(cart.id, 0)}
          class="btn btn-secondary"
        >
          <Icon src={FaTrashCan}/>
        </button>
      </td>
      <td>{cart.initialPrice}</td>
      <td>{cart.tierPrice}</td>
      <td>{cart.sellingPrice}</td>
      <td>{cart.warehouse}</td>
      <td>{cart.fullName}</td>
    {/snippet}
  </Table5>
  <div class="overflow-x-auto">
    <table class="table">
      <tbody>
        <tr>
          <td>
            <strong>Sub Total</strong>
          </td>
          <td>{subTotal}</td>
        </tr>
        <tr>
          <td>
            <strong>Total Tier Price</strong>
          </td>
          <td>{totalTierPrice}</td>
          <td>-{subTotal - totalTierPrice}</td>
        </tr>
        <tr>
          <td>
            <strong>Total</strong>
          </td>
          <td>{total}</td>
          <td>-{totalTierPrice - total}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <select bind:value={paymentTypeId} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Payment Type</option>
      {#each paymentTypeList as paymentType}
        <option value={paymentType.id}>{paymentType.name}</option>
      {/each}
    </select>
  </div>
  <div>
    <select bind:value={deliveryType} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Delivery Type</option>
      {#each Object.entries(DeliveryTypeEnum) as [label, value] }
        <option value={value}>{label}</option>
      {/each}
    </select>
  </div>
  <button class="btn btn-secondary" onclick={createOrder} disabled={paymentTypeId === ''}>Create Order</button>
  {#if !draft}
    <button class="btn not-hover:bg-slate-600" onclick={saveCart} disabled={!cartList.length}>Save Cart</button>
  {/if}
</Collapse>
