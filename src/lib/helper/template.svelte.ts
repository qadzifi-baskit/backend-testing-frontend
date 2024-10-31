import type { PaginatialPanelProps } from '@/types';

export function createPaginationPanelState(
  {
    search = '',
    max = 1,
    page = 1,
    onReload = () => undefined,
  }: PaginatialPanelProps = {},
):Required<PaginatialPanelProps> {
  return {
    search,
    max,
    page,
    onReload,
  };
}
