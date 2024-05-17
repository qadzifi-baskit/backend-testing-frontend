<script lang="ts">
  import axios from "axios";
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPen, FaSolidTrash } from 'svelte-icons-pack/fa';
  import type { MouseEventHandler } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import type { Cart, PaymentType, Product } from './types';

  let host = 'http://127.0.0.1';
  let balance = 0;
  let client = 'BASKIT_SHOP';
  let userId = writable('');
  let username = 'eight.one@gmail.com';
  let password = '12345678';
  let selectedPaymentType = '';
  const qtyMap:Record<string, number> = {};
  const productList = writable(<Product[]>[]);
  const cartList = writable(<Cart[]>[]);
  const paymentTypeList = writable(<PaymentType[]>[]);
  const authHeaders = writable(<{'X-ID': string, Authorization: string}>{
    'X-ID': '',
    Authorization: '',
  });

  authHeaders.subscribe(async (headers) => {
    const paymentResponse = await axios.get(`${host}/payment-type`, {
      headers: {
        ...headers,
        'X-CLIENT': client,
      },
    });
    if (paymentResponse.status === 200) {
      paymentTypeList.set(paymentResponse.data.data);
    }
  });

  const onAuth:MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await axios.post(`${host}/auth`, {
      username,
      password,
    });
    if (response.status === 200) {
      userId.set(response.data?.data?.id);
      authHeaders.set({
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      });
    }
  };

  productList.subscribe((value) => {
    value.forEach(({ id }) => { qtyMap[id] = 0 });
  });

  const onGetProduct:MouseEventHandler<HTMLButtonElement|HTMLInputElement> = async () => {
    const response = await axios.get(`${host}/product`, {
      headers: $authHeaders,
    });
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
    return () => {
      axios.post(`${host}/cart`, {
        qty: qtyMap[inventoryId],
        productId,
        userId: $userId,
        companyId,
        inventoryId,
        inventoryPriceTierId,
        wareHouse: 1,
      }, {
        headers: $authHeaders,
      });
    };
  };

  const onGetCart = async () => {
    const response = await axios.get(`${host}/order`, {
      headers: $authHeaders,
    });
    if (response.status === 200) {
      const [{ product: cartItemList = [] }]:{
        product: Cart[],
      }[] = [...response.data.data, {}];
      cartList.set(cartItemList);
    }
  };

  const onCreateOrder = async () => {
    const response = await axios.post(`${host}/order`, {
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
    }, {
      headers: $authHeaders,
    });
    if (response.status === 200) {
      console.log(response.data);
      for (const key in qtyMap) {
        delete qtyMap[key];
      }
    }
  };

  const onGetBalance: MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await axios.get(`${host}/wallet/${$userId}`, {
      headers: $authHeaders,
    });
    if (response.status === 200) {
      balance = response.data.data.balance;
    }
  };

  const updateCartQty = async (cartId: string, qty: number) => {
    const response = await axios.patch(`${host}/cart/${cartId}`, {
      qty,
    });
    console.log({ response });
  };
</script>

<div class="p-6">
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Host</span>
    </div>
    <select bind:value={host} class="select select-bordered">
      <option value="http://127.0.0.1" selected>Local Host</option>
      <option value="https://api-beta.baskit.app/v2">Beta</option>
    </select>
    <div class="label">
      <span class="label-text-alt">{host}</span>
    </div>
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Client</span>
    </div>
    <select bind:value={client} class="select select-bordered">
      <option value="BASKIT_SHOP" selected>Baskit Shop</option>
      <option value="BASKIT_APP">Baskit App</option>
      <option value="WEB_CMS">Web CMS</option>
    </select>
    <div class="label">
      <span class="label-text-alt">{client}</span>
    </div>
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Username</span>
    </div>
    <input type="text" placeholder="username" bind:value={username} class="input input-bordered w-full max-w-xs" />
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Password</span>
    </div>
    <input type="password" placeholder="password" bind:value={password} class="input input-bordered w-full max-w-xs" />
  </label>
  <div>
    <button class="btn" on:click={onAuth}>Auth</button>
  </div>
  <div>
    <button on:click={onGetBalance} class="btn">Get Balance</button>
    <span>Balance: {balance}</span>
  </div>
  <div>
    <button class="btn" on:click={onGetProduct}>Get Product</button>
    <button class="btn" on:click={onGetCart}>Get Cart</button>
  </div>
  <div>
    <select bind:value={selectedPaymentType} class="select select-bordered w-full max-w-xs">
      <option value="" disabled selected>Payment Type</option>
      {#each $paymentTypeList as paymentType}
      <option value={paymentType.id}>{paymentType.name}</option>
      {/each}
    </select>
    <button class="btn" on:click={onCreateOrder} disabled={selectedPaymentType === ''}>Create Order</button>
  </div>
  <div class="collapse bg-base-200">
    <input on:click={onGetProduct} type="checkbox" />
    <div class="collapse-title text-xl font-medium">Product List</div>
    <div class="collapse-content">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Status</th>
              <th>Price</th>
              <th>Qty</th>
              <th></th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {#each $productList as product}
            <tr>
              <td>{product.stock}</td>
              <td>{product.sellingPrice}</td>
              <td>{product.status}</td>
              <td>
                <input type="number" placeholder="qty" value={qtyMap[product.id]} class="input input-bordered w-24 max-w-xs"
                  on:change={(e) => { qtyMap[product.id] = Number(e.currentTarget.value) }}
                />
              </td>
              <td>
                <button class="btn bg-slate-600" on:click={onAddProduct(product)}>Add</button>
              </td>
              <td>{product.name}</td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="collapse bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">Cart List</div>
    <div class="collapse-content">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>
                Qty
              </th>
              <th></th>
              <th></th>
              <th>
                Name
              </th>
            </tr>
          </thead>
          <tbody>
            {#each $cartList as cart}
            <tr>
              <td>
                <input type="number" value={cart.qty} class="input input-bordered w-24 max-w-xs">
              </td>
              <td>
                <button class="btn bg-slate-600">
                  <Icon src={FaSolidPen}/>
                </button>
              </td>
              <td>
                <button class="btn bg-slate-600">
                  <Icon src={FaSolidTrash}/>
                </button>
              </td>
              <td>
                {cart.fullName}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style></style>
