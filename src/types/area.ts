export type Area = {
  id: number,
  name: string,
};

export const AreaType = {
  PROVINCE: 'PROVINCE',
  REGENCY: 'REGENCY',
  DISTRICT: 'DISTRICT',
} as const;
export type AreaType = typeof AreaType[keyof typeof AreaType];
