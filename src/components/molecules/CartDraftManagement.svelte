<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import { SellerAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { CartParent } from '@/types/cart';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import EditButton from '../atoms/EditButton.svelte';
  import CartDraftDetail from './CartDraftDetail.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    companyId?: string,
    show?: boolean,
  };
  let {
    client,
    store = SellerAdminStore,
    companyId = $bindable(),
    show = $bindable(false),
  }: Props = $props();

  let draftList:CartParent[] = $state([]);

  async function reloadData() {
    if (!$store.loggedIn) {
      return;
    }
    const params = new URLSearchParams({
      $sort: 'DESC',
      $order: 'createdAt',
    });
    if (companyId) {
      params.append('companyId', companyId);
    }
    stringToast('Loading...');
    const response = await client.get('/cart/draft', { params });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    draftList = response.data?.data ?? [];
    stringToast('Data loaded');
  }

  let modifyDraftDilaog:HTMLDialogElement|undefined = $state();
  $effect(() => {
    if (modifyDraftDilaog) {
      modifyDraftDilaog.onclose = () => {
        selectedDraft = undefined;
      };
    }
  });
  let selectedDraft:CartParent|undefined = $state();
  function modifyDraft(cart: CartParent) {
    return () => {
      selectedDraft = cart;
      modifyDraftDilaog?.showModal();
    };
  }
  function onModifyDelete() {
    selectedDraft = undefined;
    modifyDraftDilaog?.close();
    reloadData();
  }

  function deleteDraft(cart: CartParent) {
    return async () => {
      stringToast('Deleting...');
      const response = await client.delete(`/cart/draft/${cart.id}`);
      if (response.status !== 200) {
        return stringToast('Failed to delete');
      }
      reloadData();
      return stringToast('Deleted');
    };
  }

  $effect(() => {
    if (show) {
      reloadData();
    }
  });

  $effect(() => {
    if (modifyDraftDilaog) {
      modifyDraftDilaog.onclose = () => {
        selectedDraft = undefined;
      };
    }
  });
</script>

<CartDraftDetail
  {client}
  bind:dialog={modifyDraftDilaog}
  bind:item={selectedDraft}
  bind:companyId
  ondelete={onModifyDelete}
/>
<Collapse5 title="Cart Draft Management" bind:show>
  <PaginationNavigationPanel
    onreload={reloadData}
  />
  {#if draftList.length > 0}
    <Table5
      itemList={draftList}
    >
      {#snippet colgroup()}
        <colgroup>
          <col>
          <col>
          <col>
          <col>
          <col>
          <col>
          <col>
          <col>
          <col class="w-full">
        </colgroup>
      {/snippet}
      {#snippet header()}
        <td>Created At</td>
        <td>Id</td>
        <td>Order Code</td>
        <td></td>
        <td></td>
        <td>Total</td>
        <td>Ref Code</td>
        <td>Store Name</td>
        <td>Sales Name</td>
      {/snippet}

      {#snippet content(cart: CartParent)}
        <td><NoWrap>{cart.createdAt}</NoWrap></td>
        <td><NoWrap>{cart.id}</NoWrap></td>
        <td><NoWrap>{cart.orderCode}</NoWrap></td>
        <td>
          <EditButton onclick={modifyDraft(cart)}/>
        </td>
        <td>
          <DeleteButton onclick={deleteDraft(cart)}/>
        </td>
        <td><NoWrap>{cart.total ?? '-'}</NoWrap></td>
        <td><NoWrap>{cart.refCode}</NoWrap></td>
        <td><NoWrap>{cart.customer?.companyName ?? ''}</NoWrap></td>
        <td><NoWrap>{cart.salesName}</NoWrap></td>
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
