<script lang="ts">
  import { DeliveryTypeEnum, OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore, PaymentType, WarehouseDetail } from '@/types';
  import type { Cart, CartParent } from '@/types/cart';
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
    orderType?: OrderTypeEnum|OrderTypeEnum[],
    clientType?: string,
    memberLevel?: string|null,
    show?: boolean,
    draft?: boolean,
    draftData?: Partial<CartParent>,
    prehook?: (cart: Cart[]) => Cart[]|Promise<Cart[]>,
    onordercreated?: () => unknown,
    paymentTypeId?: string,
    deliveryType?: DeliveryTypeEnum,
  };
  let {
    client,
    store,
    userId = $bindable(),
    cartCode = $bindable(),
    companyId = $bindable(),
    orderType: orderTypeOptions = OrderTypeEnum.SHOP,
    memberLevel = $bindable(null),
    show = $bindable(false),
    draft,
    prehook,
    onordercreated: onOrderCreated = () => null,
    paymentTypeId = $bindable(''),
    deliveryType = $bindable(DeliveryTypeEnum.SELLER_DELIVERY),
  }:Props = $props();

  const orderContext = Context.get('order');
  const cartData:Record<string, Partial<Cart>> = {};
  let paymentTypeList:PaymentType[] = $state([]);
  let cartList:Cart[] = $state([]);
  let subTotal = $state(0);
  let totalTierPrice = $state(0);
  let totalSellingPrice = $state(0);
  let total = $state(0);
  let orderType = $state(typeof orderTypeOptions === 'string' ? orderTypeOptions : orderTypeOptions[0]);

  const createOrder = async () => {
    if (!$store || !$store.loggedIn) return;
    stringToast('Creating order...');
    const processedCart = prehook ? await prehook(cartList) : cartList;
    const response = await client.post('/order', {
      companyId,
      paymentTypeId,
      deliveryType,
      cartCode,
      orderType: orderTypeOptions,
      product: processedCart.map((value) => ({
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
      totalSellingPrice: number,
      total: number,
      wareHouse: WarehouseDetail,
      product: Cart[],
    }[] = response.data.data;
    for (const key in cartData) {
      delete cartData[key];
    }
    [subTotal, totalTierPrice, totalSellingPrice, total, cartList] = cartOrderList.reduce(
      (prev, curr): [number, number, number, number, Cart[]] => {
        curr.product.forEach((cart) => cartData[cart.id] = cart);
        return [
          prev[0] + curr.subTotal,
          prev[1] + curr.totalTierPrice,
          prev[2] + curr.totalSellingPrice,
          prev[3] + curr.total,
          [
            ...prev[4], ...(curr.product.map(
              (cart) => ({
                ...cart,
                warehouse: curr.wareHouse.name,
              }),
            )),
          ],
        ];
      },
      <[number, number, number, number, Cart[]]>[0, 0, 0, 0, []],
    );
    stringToast('Cart loaded');
  };

  const updateCart = async (cartId: string) => {
    if (!store || $store?.loggedIn === false) return;
    stringToast('Updating cart...');
    const data = cartData[cartId];
    const payload:Partial<Cart> = {};
    if (data.qty !== undefined) {
      payload.qty = data.qty;
    }
    if (orderType === OrderTypeEnum.SELLER_PURCHASE_ORDER) {
      if (data.tierPrice) {
        payload.startPrice = data.tierPrice;
      }
      if (data.discount) {
        payload.discount = data.discount;
      }
      if (data.discountAmount) {
        payload.discountAmount = data.discountAmount;
      }
      if (data.tax) {
        payload.tax = data.tax;
      }
    }
    const response = await client.patch(`/cart/${cartId}`, payload);
    if (response.status !== 200) return stringToast('Failed to update cart');
    stringToast('Cart updated');
    getCart();
  };
  async function deleteCart(cartId: string) {
    if (!$store || !$store.loggedIn) return;
    stringToast('Deleting cart...');
    // const response = await client.patch(`/cart/${cartId}`, { qty: 0 });
    const response = await client.delete(`/cart/${cartId}`);
    if (response.status !== 200) return stringToast('Failed to delete cart');
    stringToast('Cart deleted');
    getCart();
  }

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
    if (show) {
      memberLevel;
      updateCartMemberLevel();
    }
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
  <button class="btn not-hover:bg-slate-600" onclick={getCart}>Get Cart</button>
  <Table5
    itemList={cartList}
  >
    {#snippet header()}
      <th>Qty</th>
      {#if orderType === OrderTypeEnum.SELLER_PURCHASE_ORDER}
        <th>Initial Price</th>
        <th>Price</th>
        <th>Discount</th>
        <th>Discount Amount</th>
        <th>Tax</th>
      {/if}
      <th></th>
      <th></th>
      {#if orderType !== OrderTypeEnum.SELLER_PURCHASE_ORDER}
        <th>Initial Price</th>
        <th>Tier Price</th>
        <th>Selling Price</th>
      {/if}
      <th>Warehouse</th>
      <th>Name</th>
    {/snippet}

    {#snippet content(cart: Cart)}
      <td>
        <input type="number" bind:value={cartData[cart.id].qty} class="input input-bordered w-24 max-w-xs">
      </td>
      {#if orderType === OrderTypeEnum.SELLER_PURCHASE_ORDER}
        <td>
          <input type="number" readonly value={cart.initialPrice} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" bind:value={cartData[cart.id].tierPrice} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" bind:value={cartData[cart.id].discount} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" bind:value={cartData[cart.id].discountAmount} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" bind:value={cartData[cart.id].tax} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" readonly bind:value={cartData[cart.id].sellingPrice} class="input input-bordered w-24 max-w-xs">
        </td>
      {/if}
      <td>
        <button
          onclick={() => updateCart(cart.id)}
          class="btn btn-secondary"
        >
          <Icon src={FaFloppyDisk}/>
        </button>
      </td>
      <td>
        <button
          onclick={() => deleteCart(cart.id)}
          class="btn btn-secondary"
        >
          <Icon src={FaTrashCan}/>
        </button>
      </td>
      {#if orderType !== OrderTypeEnum.SELLER_PURCHASE_ORDER}
        <td>{cart.initialPrice}</td>
        <td>{cart.tierPrice}</td>
        <td>{cart.sellingPrice}</td>
      {/if}
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
            <strong>Total Selling Price</strong>
          </td>
          <td>{totalSellingPrice}</td>
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
  {#if Array.isArray(orderTypeOptions)}
    <div>
      <select bind:value={orderType} class="select select-bordered w-full max-w-xs">
        <option value="" disabled selected>Payment Type</option>
        {#each orderTypeOptions as options}
          <option value={options}>{options}</option>
        {/each}
      </select>
    </div>
  {/if}
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
    <button class="btn not-hover:bg-slate-600" onclick={saveCart}>Save Cart</button>
  {/if}
</Collapse>
