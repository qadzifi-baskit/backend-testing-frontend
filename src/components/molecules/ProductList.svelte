<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { debounce } from '@/lib/helper/util';
  import type { Product } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { MouseEventHandler } from 'svelte/elements';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Select from '../Select.svelte';
  import Table from '../Table.svelte';

  type Props = {
    client: AxiosInstance,
    userId: string,
    onProductAdded?: (() => unknown),
  };
  let {
    client,
    userId,
    onProductAdded = () => null,
  }: Props = $props();
  let companyId = $state('');
  let productList:Product[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  const qtyMap:Record<string, number> = $state({});
  let warehouseOptions = $state<[string, string][]>([['', 'All']]);

  const getProduct = async () => {
    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    params.append('name', search);
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

  const debounceGetProduct = debounce(getProduct);

  listenAuthSuccess(() => {
    getProduct();
  });

  $effect(() => {
    companyId;
    search;
    page = 1;
  });

  $effect(() => {
    companyId;
    page;
    search;
    debounceGetProduct();
  });

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

  $effect(() => {
    productList.forEach(({ id }) => { qtyMap[id] = 0 });
  });
</script>

<Collapse class="overflow-x-auto" onClick={getProduct} title="Product List">
  <Select
    showValue
    options={warehouseOptions}
    bind:value={companyId}
  />
  <PaginationNavigationPanel
    bind:max
    bind:page
    bind:search
  />
  <button class="btn" onclick={getProduct}>Get Product</button>
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
            onchange={(e) => { qtyMap[item.id] = Number(e.currentTarget.value) }}
          />
        </td>
        <td>
          <button class="btn bg-slate-600" onclick={onAddProduct(item)}>Add</button>
        </td>
        <td>{item.name}</td>
      </svelte:fragment>
    </Table>
  {/if}
</Collapse>
