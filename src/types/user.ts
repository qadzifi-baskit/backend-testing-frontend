export type Role = {
  id: string,
  roleName: string,
};

export type Profile = {
  avatars: string|null,
  firstName: string,
  lastName: string,
  address: string,
  country: string|null,
  position: string|null,
  gstRegistrationNo: string|null,
  zipCode: string|null,
  state: string|null,
  language: string|null,
  currency: string|null,
  timeZone: string|null,
  socialAccount: string|null,
  targetDuration: string|null,
  targetAmount: number,
  idCard: string|null,
  taxPayerIdNumber: string|null,
  document: string|null,
  provinceId: string|null,
  regencyId: string|null,
  districtId: number,
  referralCode: string|null,
};

export type User = {
  id: string,
  email: string,
  phone: string,
  status: string,
  rejectReason: string|null,
  activatedToken: string|null,
  fcmToken: string|null,
  shopLoggedIn: false,
  mongoId: string|null,
  profile: Profile|null,
  roles: Role[],
  countBuyerAssigned: number,
  leader: string|null,
  lastAccess: string|null,
  createdAt: string
};

export type UserOffline = {
  id: string,
  status: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  customerTypeId: string,
  companyName: string,
  address: string,
};

export type CreateFieldTeamData = {
  id: string,
  phone: string,
  firstName: string,
  lastName: string,
};

export type CreateFieldTeamResponse = {
  data: CreateFieldTeamData,
};
