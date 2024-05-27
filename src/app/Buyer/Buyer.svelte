<script lang="ts">
  import axios from "axios";
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import type { MouseEventHandler } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import Collapse from "../../components/Collapse.svelte";
  import Select from "../../components/Select.svelte";
  import Table from "../../components/Table.svelte";
  import Auth from "../../components/molecules/Auth.svelte";
  import type { Cart, PaymentType, Product } from '../../types';
  const client = axios.create();

  let host = 'https://api-beta.baskit.app/v2';
  let balance = 0;
  let clientType = 'BASKIT_SHOP';
  let userId = writable('');
  let username = 'eight.one@gmail.com';
  let password = '12345678';
  let selectedPaymentType = '';
  const qtyMap:Record<string, number> = {};
  const cartQtyMap:Record<string, number> = {};
  const productList = writable(<Product[]>[]);
  const cartList = writable(<Cart[]>[]);
  const paymentTypeList = writable(<PaymentType[]>[]);

  const onGetPaymentType = async () => {
    const paymentResponse = await client.get(`${host}/payment-type`, {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (paymentResponse.status === 200) {
      paymentTypeList.set(paymentResponse.data.data);
    }
  };

  productList.subscribe((value) => {
    value.forEach(({ id }) => { qtyMap[id] = 0 });
  });

  const onGetProduct = async () => {
    const response = await client.get(`${host}/product`);
    if (response.status === 200) {
      productList.set(response.data.data);
    }
  };

  const onAddProduct = ({
    productId,
    companyId,
    id: inventoryId,
    priceTiers: [{ id: inventoryPriceTierId }],
  }: Product): MouseEventHandler<HTMLButtonElement> => {
    return async () => {
      await client.post(`${host}/cart`, {
        qty: qtyMap[inventoryId],
        productId,
        userId: $userId,
        companyId,
        inventoryId,
        inventoryPriceTierId,
        wareHouse: 1,
      });
      onGetCart();
    };
  };

  const onGetCart = async () => {
    const response = await client.get(`${host}/order`);
    if (response.status === 200) {
      const [{ product: cartItemList = [] }]:{
        product: Cart[],
      }[] = [...response.data.data, {}];
      cartList.set(cartItemList);
    }
  };

  const onCreateOrder = async () => {
    const response = await client.post(`${host}/order`, {
      paymentTypeId: selectedPaymentType,
      product: $cartList.map((value) => ({
        cartId: value.id,
        inventoryId: value.inventoryId,
        productId: value.productId,
        qty: value.qty,
        price: value.sellingPrice,
        companyId: value.companyId,
      })),
      userId: $userId,
    });
    if (response.status === 200) {
      for (const key in qtyMap) {
        delete qtyMap[key];
      }
    }
  };

  const onGetBalance = async () => {
    const response = await client.get(`${host}/wallet/${$userId}`);
    if (response.status === 200) {
      balance = response.data.data.balance;
    }
  };

  const updateCartQty = async (cartId: string, qty: number) => {
    const response = await client.patch(`${host}/cart/${cartId}`, {
      qty,
    });
    if (response.status === 200) {
      for (const key in cartQtyMap) {
        delete cartQtyMap[key];
      }
      onGetCart();
    }
  };

  const onAuth = async () => {
    const response = await client.post(`${host}/auth`, {
      username,
      password,
    });
    if (response.status === 200) {
      userId.set(response.data?.data?.id);
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      onGetBalance();
      onGetPaymentType();
      onGetProduct();
      onGetCart();
    }
  };
</script>

<div class="p-6">
  <Collapse title="Config" show>
    <Select
      title="Host"
      showValue
      options={[
        ['http://127.0.0.1', 'Local Host'],
        ['https://api-beta.baskit.app/v2', 'Beta'],
      ]}
      bind:value={host}
    />
    <Select
      title="Client"
      showValue
      options={[
        ['BASKIT_SHOP', 'Baskit Shop'],
        ['BASKIT_APP', 'Baskit App'],
        ['WEB_CMS', 'Web CMS'],
      ]}
      bind:value={clientType}
    />
  </Collapse>
  <Collapse title="Auth">
    <Auth
      bind:username
      bind:password
      onAuth={onAuth}
    />
  </Collapse>
  <Collapse title="Profile">
    <button on:click={onGetBalance} class="btn bg-slate-600">Get Balance</button>
    <span>Balance: {balance}</span>
  </Collapse>
  <Collapse class="overflow-x-auto" onClick={onGetProduct} title="Product List">
    <button class="btn" on:click={onGetProduct}>Get Product</button>
    {#if $productList.length > 0}
    <Table itemList={$productList}>
      <svelte:fragment slot="header">
        <th>Stock</th>
        <th>Status</th>
        <th>Price</th>
        <th>Qty</th>
        <th></th>
        <th>Name</th>
      </svelte:fragment>
      <svelte:fragment slot="item" let:item>
        <td>{item.stock}</td>
        <td>{item.sellingPrice}</td>
        <td>{item.status}</td>
        <td>
          <input type="number" placeholder="qty" value={qtyMap[item.id]} class="input input-bordered w-24 max-w-xs"
            on:change={(e) => { qtyMap[item.id] = Number(e.currentTarget.value) }}
          />
        </td>
        <td>
          <button class="btn bg-slate-600" on:click={onAddProduct(item)}>Add</button>
        </td>
        <td>{item.name}</td>
      </svelte:fragment>
    </Table>
    {/if}
  </Collapse>
  <Collapse class="overflow-x-auto" onClick={onGetCart} title="Order Summary">
    <button class="btn" on:click={onGetCart}>Get Cart</button>
    {#if $cartList.length > 0}
    <Table itemList={$cartList}>
      <svelte:fragment slot="header">
        <th>
          Qty
        </th>
        <th></th>
        <th></th>
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
          {cart.fullName}
        </td>
      </svelte:fragment>
    </Table>
    {/if}
    <div>
      <select bind:value={selectedPaymentType} class="select select-bordered w-full max-w-xs">
        <option value="" disabled selected>Payment Type</option>
        {#each $paymentTypeList as paymentType}
        <option value={paymentType.id}>{paymentType.name}</option>
        {/each}
      </select>
      <button class="btn" on:click={onCreateOrder} disabled={selectedPaymentType === ''}>Create Order</button>
    </div>
  </Collapse>
</div>

<style></style>
