export type Tutorial = {
  id: string,
  ownerId: string|null,
  referenceId: string|null,
  name: string,
  categoryId: string|null,
  title: string,
  description: string,
  number: number|null,
  parentId: string|null,
  completed?: boolean,
};
