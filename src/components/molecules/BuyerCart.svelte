<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { DeliveryTypeEnum, OrderTypeEnum } from '@/lib/enum';
  import type { AuthStore, Cart, PaymentType, WarehouseDetail } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    userId?: string,
    orderType?: OrderTypeEnum,
    clientType?: string,
    memberLevel?: string|null,
    onOrderCreated?: () => unknown,
  };
  let {
    client,
    store,
    userId = $bindable(),
    orderType = OrderTypeEnum.SHOP,
    clientType = 'BASKIT_SHOP',
    memberLevel = $bindable(null),
    onOrderCreated = () => null,
  }:Props = $props();

  const cartQtyMap:Record<string, number> = {};
  let paymentTypeList:PaymentType[] = $state([]);
  let cartList:Cart[] = $state([]);
  let paymentTypeId = $state('');
  let subTotal = $state(0);
  let totalTierPrice = $state(0);
  let total = $state(0);
  let deliveryType:DeliveryTypeEnum = $state(DeliveryTypeEnum.SELLER_DELIVERY);

  const getPaymentType = async () => {
    if (!$store || !$store.loggedIn) return;
    const paymentResponse = await client.get('/payment-type', {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (paymentResponse.status === 200) {
      paymentTypeList = paymentResponse.data.data;
    }
  };

  const createOrder = async () => {
    if (!$store || !$store.loggedIn) return;
    const response = await client.post('/order', {
      paymentTypeId,
      deliveryType,
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
    if (response.status === 200) {
      onOrderCreated();
    }
  };

  const getCart = async () => {
    if (!$store || !$store.loggedIn) return;
    const params = new URLSearchParams();
    params.append('orderType', orderType);
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
  };

  const updateCartQty = async (cartId: string, qty: number) => {
    if (!store || $store?.loggedIn === false) return;
    const response = await client.patch(`/cart/${cartId}`, {
      qty,
    });
    if (response.status !== 200) return;
    for (const key in cartQtyMap) {
      delete cartQtyMap[key];
    }
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

  $effect(() => {
    getPaymentType();
    getCart();
  });

  listenAuthSuccess(() => {
    getPaymentType();
    getCart();
  });
</script>

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
      class="btn bg-slate-600"
    >
      <Icon src={FaFloppyDisk}/>
    </button>
  </td>
  <td>
    <button
      onclick={() => updateCartQty(cart.id, 0)}
      class="btn bg-slate-600"
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

<Collapse class="overflow-x-auto" onClick={getCart} title="Order Summary">
  <button class="btn" onclick={getCart}>Get Cart</button>
  <Table5
    itemList={cartList}
    {header}
    {content}
  />
  <div class="label"></div>
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
  <div class="label"></div>
  <div>
    <select bind:value={paymentTypeId} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Payment Type</option>
      {#each paymentTypeList as paymentType}
        <option value={paymentType.id}>{paymentType.name}</option>
      {/each}
    </select>
  </div>
  <div class="label"></div>
  <div>
    <select bind:value={deliveryType} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Delivery Type</option>
      {#each Object.entries(DeliveryTypeEnum) as [label, value] }
        <option value={value}>{label}</option>
      {/each}
    </select>
    <button class="btn" onclick={createOrder} disabled={paymentTypeId === ''}>Create Order</button>
  </div>
</Collapse>
