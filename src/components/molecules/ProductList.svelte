<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import type { MouseEventHandler } from 'svelte/elements';
  import type { Product } from '@/types';
  import Table from '../Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';

  export let client:AxiosInstance;
  export let auth:Record<string, string>;
  export let userId:string;
  export let onProductAdded:(() => unknown) = () => null;
  let companyId = '';
  let productList:Product[] = [];
  let page = 1;
  let max = 1;

  const qtyMap:Record<string, number> = {};
  let warehouseOptions = [<[string, string]>['', 'All']];

  export const onGetProduct = async () => {
    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    if (companyId) {
      params.append('id', companyId);
    }
    const response = await client.get('/product/search',
      {
        params,
      },
    );
    if (response.status === 200) {
      max = response.data?.totalPage ?? 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productList = (response.data.data as any[]).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prev, curr) => [...prev, ...(curr.product as any[]).map((value) => ({
          ...value,
          warehouse: curr.wareHouse.name,
        }))],
        [],
      );
    }
  };

  const debounceGetProduct = debounce(onGetProduct);

  $: {
    auth;
    onGetProduct();
  }

  $: {
    companyId;
    page = 1;
  }

  $: {
    companyId;
    page;
    debounceGetProduct();
  }

  const onAddProduct = ({
    productId,
    companyId,
    warehouse,
    id: inventoryId,
    priceTiers: [{ id: inventoryPriceTierId }],
  }: Product): MouseEventHandler<HTMLButtonElement> => {
    return async () => {
      await client.post('/cart', {
        qty: qtyMap[inventoryId],
        productId,
        userId,
        companyId,
        inventoryId,
        inventoryPriceTierId,
        wareHouse: warehouse,
      });
      onProductAdded();
    };
  };

  $: {
    productList.forEach(({ id }) => { qtyMap[id] = 0 });
  }
</script>

<Collapse class="overflow-x-auto" onClick={onGetProduct} title="Product List">
  <Select
    showValue
    options={warehouseOptions}
    bind:value={companyId}
  />
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  <button class="btn" on:click={onGetProduct}>Get Product</button>
  {#if productList.length > 0}
    <Table itemList={productList}>
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
        <td>{item.status}</td>
        <td>{item.sellingPrice}</td>
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
