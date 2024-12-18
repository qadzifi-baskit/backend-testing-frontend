import type { PaginationPanelProps } from '@/types/pagination';

export function createPaginationPanelState(
  {
    search = '',
    max = 1,
    page = 1,
    sort = null,
    order = 'ASC',
    onreload = () => undefined,
    onadd = () => undefined,
    sortOptions = [],
  }: PaginationPanelProps = {},
):Required<PaginationPanelProps> {
  return {
    search,
    max,
    page,
    sort,
    order,
    onreload,
    onadd,
    sortOptions,
  };
}
