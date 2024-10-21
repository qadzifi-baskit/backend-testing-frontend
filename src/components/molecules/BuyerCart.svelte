<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import type { AxiosInstance } from 'axios';
  import type { Cart, PaymentType, WarehouseDetail } from '@/types';

  export let client:AxiosInstance;
  export let auth:Record<string,string>;
  export let userId:string;
  export let clientType = 'BASKIT_SHOP';
  export let onOrderCreated:(() => unknown) = () => null;

  const cartQtyMap:Record<string, number> = {};
  let paymentTypeList = <PaymentType[]>[];
  let cartList = <Cart[]>[];
  let selectedPaymentType = '';

  const onGetPaymentType = async () => {
    const paymentResponse = await client.get('/payment-type', {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (paymentResponse.status === 200) {
      paymentTypeList = paymentResponse.data.data;
    }
  };

  const onCreateOrder = async () => {
    const response = await client.post('/order', {
      paymentTypeId: selectedPaymentType,
      product: cartList.map((value) => ({
        cartId: value.id,
        inventoryId: value.inventoryId,
        productId: value.productId,
        qty: value.qty,
        price: value.sellingPrice,
        companyId: value.companyId,
      })),
      userId,
    });
    if (response.status === 200) {
      onOrderCreated();
    }
  };

  const onGetCart = async () => {
    const response = await client.get('/order');
    if (response.status === 200) {
      const cartOrderList:{
        wareHouse: WarehouseDetail,
        product: Cart[],
      }[] = response.data.data;
      cartList = cartOrderList.reduce(
        (prev, curr) => [...prev, ...(curr.product.map(
          (cart) => ({
            ...cart,
            warehouse: curr.wareHouse.name,
          }),
        ))],
        <Cart[]>[],
      );
    }
  };

  $: {
    auth;
    onGetPaymentType();
    onGetCart();
  }

  const updateCartQty = async (cartId: string, qty: number) => {
    const response = await client.patch(`/cart/${cartId}`, {
      qty,
    });
    if (response.status === 200) {
      for (const key in cartQtyMap) {
        delete cartQtyMap[key];
      }
      onGetCart();
    }
  };
</script>

<Collapse class="overflow-x-auto" onClick={onGetCart} title="Order Summary">
  <button class="btn" on:click={onGetCart}>Get Cart</button>
  {#if cartList.length > 0}
    <Table itemList={cartList}>
      <svelte:fragment slot="header">
        <th>
          Qty
        </th>
        <th></th>
        <th></th>
        <th>
          Warehouse
        </th>
        <th>
          Name
        </th>
      </svelte:fragment>
      <svelte:fragment slot="item" let:item={cart}>
        <td>
          <input type="number" value={cart.qty} class="input input-bordered w-24 max-w-xs"
            on:change={(e) => { cartQtyMap[cart.id] = Number(e.currentTarget.value) }}
          >
        </td>
        <td>
          <button
            on:click={() => updateCartQty(cart.id, cartQtyMap[cart.id])}
            class="btn bg-slate-600"
          >
            <Icon src={FaFloppyDisk}/>
          </button>
        </td>
        <td>
          <button
            on:click={() => updateCartQty(cart.id, 0)}
            class="btn bg-slate-600"
          >
            <Icon src={FaTrashCan}/>
          </button>
        </td>
        <td>
          {cart.warehouse}
        </td>
        <td>
          {cart.fullName}
        </td>
      </svelte:fragment>
    </Table>
  {/if}
  <div>
    <select bind:value={selectedPaymentType} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Payment Type</option>
      {#each paymentTypeList as paymentType}
        <option value={paymentType.id}>{paymentType.name}</option>
      {/each}
    </select>
    <button class="btn" on:click={onCreateOrder} disabled={selectedPaymentType === ''}>Create Order</button>
  </div>
</Collapse>
