import type { PaginationParams } from '@/types/pagination';

export function getPaginationParams():Required<PaginationParams> {
  return {
    search: '',
    limit: 10,
    max: 1,
    page: 1,
  };
}
