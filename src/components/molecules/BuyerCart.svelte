<script lang="ts">
  import { OverStockOrderTypeList } from '@/consts/order';
  import { DeliveryTypeEnum, OrderStatusEnum, OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { PaymentType, WarehouseDetail } from '@/types';
  import type { Cart, CartParent, CartUpdatePayload } from '@/types/cart';
  import type { CreateOrderPayload } from '@/types/order';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import FormInput from '../atoms/FormInput.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import CartDraftDetail from './CartDraftDetail.svelte';
  import { isNil } from '@/lib/helper/util';
  import AddButton from '../atoms/AddButton.svelte';

  type Props = {
    userId?: string,
    cartCode?: string,
    companyId?: string,
    ordertype?: OrderTypeEnum|OrderTypeEnum[],
    selectedOrderType?: OrderTypeEnum,
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
    userId = $bindable(),
    cartCode = $bindable(),
    companyId = $bindable(),
    ordertype: orderTypeOptions = OrderTypeEnum.SHOP,
    selectedOrderType = $bindable(),
    memberLevel = $bindable(null),
    show = $bindable(false),
    draft,
    prehook,
    onordercreated: onOrderCreated = () => null,
    paymentTypeId = $bindable(''),
    deliveryType = $bindable(DeliveryTypeEnum.SELLER_DELIVERY),
    clientType = $bindable(),
  }:Props = $props();

  const cartData:Record<string, Partial<Cart>> = {};
  const { client, auth } = Context.strict;

  let paymentTypeList:PaymentType[] = $state([]);
  let cartList:Cart[] = $state([]);
  let subTotal = $state(0);
  let totalTierPrice = $state(0);
  let totalSellingPrice = $state(0);
  let totalDiscount = $state(0);
  let totalDiscountedPrice = $state(0);
  let total = $state(0);
  let linkedOrderId = $state<string>();

  if (Array.isArray(orderTypeOptions)) {
    selectedOrderType = orderTypeOptions[0];
  } else if (orderTypeOptions) {
    selectedOrderType = orderTypeOptions;
  }

  const createOrder = async () => {
    if (!$auth || !$auth.loggedIn) return;
    stringToast('Creating order...');
    const processedCart = prehook ? await prehook(cartList) : cartList;
    const addedData:CreateOrderPayload = {};
    if (selectedOrderType === OrderTypeEnum.SELLER_PURCHASE_ORDER) {
      addedData.status = OrderStatusEnum.WAITING_FOR_CONFIRMATION;

      if (linkedOrderId) {
        addedData.linkedOrderId = linkedOrderId;
      }
    }
    if (selectedOrderType === OrderTypeEnum.SELLER_SALES_ORDER) {
      const totalNeededQty = processedCart.reduce(
        (acc, curr) => acc + (curr.neededQty ?? 0),
        0,
      );
      if (totalNeededQty > 0) {
        addedData.status = OrderStatusEnum.WAITING_FOR_CONFIRMATION;
      }
    }
    const totalQty = processedCart.reduce(
      (acc, curr) => acc + (curr.neededQty ?? 0),
      0,
    );
    let status:OrderStatusEnum = OrderStatusEnum.ORDER_CREATED;
    if (totalQty > 0) {
      status = OrderStatusEnum.WAITING_FOR_CONFIRMATION;
    }

    const response = await client.post('/order', {
      companyId,
      paymentTypeId,
      deliveryType,
      cartCode,
      orderType: selectedOrderType,
      status,
      ...addedData,
      product: processedCart.map((value) => ({
        cartId: value.id,
        inventoryId: value.inventoryId,
        productId: value.productId,
        qty: value.qty,
        neededQty: value.neededQty,
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
    if (!$auth || !$auth.loggedIn) return;
    stringToast('Loading cart...');
    const params = new URLSearchParams();
    if (selectedOrderType) {
      params.append('orderType', selectedOrderType);
    }
    if ($auth.userId) {
      params.append('createdBy', $auth.userId);
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
      totalDiscount: number,
      totalDiscountedPrice: number,
      total: number,
      wareHouse: WarehouseDetail,
      product: Cart[],
    }[] = response.data.data;
    for (const key in cartData) {
      delete cartData[key];
    }
    type Summary = [number, number, number, number, number, number, Cart[]];
    [
      subTotal,
      totalTierPrice,
      totalSellingPrice,
      totalDiscount,
      totalDiscountedPrice,
      total,
      cartList,
    ] = cartOrderList.reduce(
      (
        [
          accSubTotal,
          accTotalTierPrice,
          accTotalSellingPrice,
          accTotalDiscount,
          accTotalDiscountedPrice,
          accTotal,
          accCartList,
        ],
        curr,
      ): Summary => {
        curr.product.forEach((cart) => cartData[cart.id] = cart);
        return [
          accSubTotal + curr.subTotal,
          accTotalTierPrice + curr.totalTierPrice,
          accTotalSellingPrice + curr.totalSellingPrice,
          accTotalDiscount + curr.totalDiscount,
          accTotalDiscountedPrice + curr.totalDiscountedPrice,
          accTotal + curr.total,
          [
            ...accCartList, ...(curr.product.map(
              (cart) => ({
                ...cart,
                warehouse: curr.wareHouse.name,
              }),
            )),
          ],
        ];
      },
      <Summary>[0, 0, 0, 0, 0, 0, []],
    );
    stringToast('Cart loaded');
  };

  const updateCart = async (cartId: string) => {
    if (!auth || $auth?.loggedIn === false) return;
    stringToast('Updating cart...');
    const data = cartData[cartId];
    const payload:CartUpdatePayload = {};
    if (selectedOrderType) {
      payload.orderType = selectedOrderType;
    }
    if (data.qty !== undefined) {
      payload.qty = data.qty;
    }
    if (
      selectedOrderType === OrderTypeEnum.SELLER_SALES_ORDER
    ) {
      if (data.neededQty !== undefined) {
        payload.neededQty = data.neededQty;
      }
    }
    if (
      selectedOrderType === OrderTypeEnum.SELLER_SALES_ORDER ||
      selectedOrderType === OrderTypeEnum.SELLER_PURCHASE_ORDER
    ) {
      if (data.tierPrice) {
        payload.startPrice = data.tierPrice;
      }
      if (!isNil(data.discount)) {
        payload.discount = data.discount;
      }
      if (!isNil(data.discountAmount)) {
        payload.discountAmount = data.discountAmount;
      }
      if (data.taxType) {
        payload.taxType = data.taxType;
      } else if (data.taxType !== undefined) {
        payload.taxType = null;
      }
      if (data.tax) {
        payload.tax = data.tax;
      }
      if (data.unitId) {
        payload.unitId = data.unitId;
      }
    }
    const response = await client.patch(`/cart/${cartId}`, {
      ...payload,
    });
    if (response.status !== 200) return stringToast('Failed to update cart');
    stringToast('Cart updated');
    getCart();
  };
  async function deleteCart(cartId: string) {
    if (!$auth || !$auth.loggedIn) return;
    stringToast('Deleting cart...');
    const response = await client.delete(`/cart/${cartId}`);
    if (response.status !== 200) return stringToast('Failed to delete cart');
    stringToast('Cart deleted');
    getCart();
  }

  const updateCartMemberLevel = async () => {
    if (!$auth || !$auth.loggedIn) return;
    const params = new URLSearchParams();
    params.append('createdBy', $auth.userId);
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

  async function getPaymentType() {
    if (!$auth.loggedIn) return;
    stringToast('Loading payment type...');
    const response = await client.get('/payment-type', {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (response.status !== 200) return stringToast('Failed to load payment type');
    paymentTypeList = response.data?.data ?? [];
    stringToast('Payment type loaded');
  };

  $effect(() => {
    if (show) {
      getCart();
      getPaymentType();
    }
  });

  let addTempProduct = $state(false);
  let addingTempProduct = $state(false);
  const tempProduct = $state({
    tempName: '',
    unitName: '',
  });
  async function addTempProductToCart() {
    if (!$auth || !$auth.loggedIn) return;
    addingTempProduct = true;
    stringToast('Adding temporary product to cart...');
    const response = await client.post('/cart/temp', {
      ...tempProduct,
      companyId,
      orderType: selectedOrderType,
    });
    if (response.status !== 200) {
      return stringToast('Failed to add temporary product to cart');
    }
    addTempProduct = false;
    addingTempProduct = false;
    getCart();
    return stringToast('Temporary product added to cart');
  }
</script>

{#if !draft}
  <CartDraftDetail
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
  <Table5 itemList={cartList} pincols>
    {#snippet header()}
      <td>Qty</td>
      {#if selectedOrderType === OrderTypeEnum.SELLER_SALES_ORDER}
        <td>Needed Qty</td>
      {/if}
      {#if OverStockOrderTypeList.includes(selectedOrderType)}
        <td>Unit</td>
        <td>Initial Price</td>
        <td>Price</td>
        <td>Discount</td>
        <td>Discount Amount</td>
        <td>Tax Type</td>
        <td>Tax</td>
        <td>Selling Price</td>
      {/if}
      {#if !OverStockOrderTypeList.includes(selectedOrderType)}
        <td>Initial Price</td>
        <td>Tier Price</td>
        <td>Selling Price</td>
      {/if}
      <td>Warehouse</td>
      <td>Name</td>
      <th></th>
    {/snippet}

    {#snippet content(cart: Cart)}
      <td>
        <input type="number" bind:value={cartData[cart.id].qty} class="input input-bordered w-24 max-w-xs">
      </td>
      {#if selectedOrderType === OrderTypeEnum.SELLER_SALES_ORDER}
        <td>
          <input type="number" bind:value={cartData[cart.id].neededQty} class="input input-bordered w-24 max-w-xs">
        </td>
      {/if}
      {#if OverStockOrderTypeList.includes(selectedOrderType)}
        <td>
          {#if cart.stockCount}
            <!-- <DropdownSelect -->
            <!--   options={cart.stockCount.map((stock) => [stock.unitId, stock.unit])} -->
            <!--   bind:value={cartData[cart.id].unitId} -->
            <!-- /> -->
            <select class="select w-auto" bind:value={cartData[cart.id].unitId}>
              {#each cart.stockCount as stock}
                <option value={stock.unitId} selected={cartData[cart.id].unitId === stock.unitId}>
                  {stock.unit}
                </option>
              {/each}
            </select>
          {/if}
        </td>
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
          <input bind:value={cartData[cart.id].taxType} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" bind:value={cartData[cart.id].tax} class="input input-bordered w-24 max-w-xs">
        </td>
        <td>
          <input type="number" readonly bind:value={cartData[cart.id].sellingPrice} class="input input-bordered w-24 max-w-xs">
        </td>
      {/if}
      {#if !OverStockOrderTypeList.includes(selectedOrderType)}
        <td>{cart.initialPrice}</td>
        <td>{cart.tierPrice}</td>
        <td>{cart.sellingPrice}</td>
      {/if}
      <td>{cart.warehouse}</td>
      <td><span class="wrap-line-column">{cart.fullName}</span></td>
      <th class="flex gap-1">
        <button onclick={() => updateCart(cart.id)} class="btn btn-secondary">
          <Icon src={FaFloppyDisk}/>
        </button>
        <button onclick={() => deleteCart(cart.id)} class="btn btn-secondary">
          <Icon src={FaTrashCan}/>
        </button>
      </th>
    {/snippet}

    {#snippet lastRow()}
      {#if addTempProduct}
        <tr>
          <td>
            <AddButton onclick={addTempProductToCart}/>
          </td>
          <td>
            <input disabled={addingTempProduct} type="text" placeholder="product name" bind:value={tempProduct.tempName}>
          </td>
          <td>
            <input disabled={addingTempProduct} type="text" placeholder="unit name" bind:value={tempProduct.unitName}>
          </td>
        </tr>
      {/if}
      <tr>
        <td>
          <AddButton onclick={() => addTempProduct = true}/>
        </td>
      </tr>
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
          <td>{totalTierPrice - subTotal}</td>
        </tr>
        <tr>
          <td>
            <strong>Total Discounted Price</strong>
          </td>
          <td>{totalDiscountedPrice}</td>
          <td>{-totalDiscount}</td>
        </tr>
        <tr>
          <td>
            <strong>Total Selling Price</strong>
          </td>
          <td>{totalSellingPrice}</td>
          <td>{totalSellingPrice - totalDiscountedPrice}</td>
        </tr>
        <tr>
          <td>
            <strong>Total</strong>
          </td>
          <td>{total}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  {#if Array.isArray(orderTypeOptions)}
    <div>
      <select bind:value={selectedOrderType} class="select select-bordered w-full max-w-xs">
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
  {#if selectedOrderType === OrderTypeEnum.SELLER_PURCHASE_ORDER}
    <FormInput label="Linked Order Id" bind:value={linkedOrderId}/>
  {/if}
  <button class="btn btn-secondary" onclick={createOrder} disabled={paymentTypeId === ''}>Create Order</button>
  {#if !draft}
    <button class="btn not-hover:bg-slate-600" onclick={saveCart}>Save Cart</button>
  {/if}
</Collapse>
