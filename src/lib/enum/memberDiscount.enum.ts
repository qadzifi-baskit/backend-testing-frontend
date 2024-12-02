export const MemberDiscountLevel = {
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;
export type MemberDiscountLevel =
  (typeof MemberDiscountLevel)[keyof typeof MemberDiscountLevel];
