export const PaginationOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
export type PaginationOrder = typeof PaginationOrder[keyof typeof PaginationOrder];

export type PaginationParams = {
  search?: string,
  max?: number,
  limit?: number,
  page?: number,
};

export type PaginationPanelProps<
  OnReload extends (...args: unknown[]) => unknown = () => void,
  OnAdd extends (...args: unknown[]) => unknown = () => void,
> = PaginationParams & {
  sort?: string|null,
  order?: string,
  onreload?: OnReload,
  onadd?: OnAdd,
  sortOptions?: ([string]|[string, string])[],
  orderOptions?: [string, string][],
};
