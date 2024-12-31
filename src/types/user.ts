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
