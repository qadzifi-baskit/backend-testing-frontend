import type { AreaType } from '@/types/area';

export const AreaParentParamKey:Partial<Record<AreaType, string>> = {
  REGENCY: 'provinceId',
  DISTRICT: 'regencyId',
};
