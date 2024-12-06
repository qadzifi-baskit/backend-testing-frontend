import type { PaginatialPanelProps } from '@/types';

export function createPaginationPanelState(
  {
    search = '',
    max = 1,
    page = 1,
    onreload = () => undefined,
    onadd = () => undefined,
  }: PaginatialPanelProps = {},
):Required<PaginatialPanelProps> {
  return {
    search,
    max,
    page,
    onreload,
    onadd,
  };
}
