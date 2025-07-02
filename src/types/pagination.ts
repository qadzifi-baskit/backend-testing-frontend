export const PaginationOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
export type PaginationOrder = typeof PaginationOrder[keyof typeof PaginationOrder];

export type PaginationPanelProps<
  OnReload extends (...args: unknown[]) => unknown = () => void,
  OnAdd extends (...args: unknown[]) => unknown = () => void,
> = {
  search?: string,
  max?: number,
  limit?: number,
  page?: number,
  sort?: string|null,
  order?: PaginationOrder,
  onreload?: OnReload,
  onadd?: OnAdd,
  sortOptions?: ([string]|[string, string])[],
};
