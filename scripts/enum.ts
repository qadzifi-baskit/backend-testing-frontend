export const AppType = {
  Buyer: 'Buyer',
  Seller: 'Seller',
  SellerInbound: 'SellerInbound',
  BaskitAdmin: 'BaskitAdmin',
  SuperAdmin: 'SuperAdmin',
  BrandUser: 'BrandUser',
} as const;

export type AppTypeKey = keyof typeof AppType;
export type AppType = typeof AppType[AppTypeKey];

export const AppEntry:Record<AppTypeKey, string> = {
  Buyer: 'src/entry/buyer/index.html',
  Seller: 'src/entry/seller/index.html',
  SellerInbound: 'src/entry/seller/inbound/index.html',
  BaskitAdmin: 'src/entry/baskit-admin/index.html',
  SuperAdmin: 'src/entry/super-admin/index.html',
  BrandUser: 'src/entry/brand-user/index.html',
};
