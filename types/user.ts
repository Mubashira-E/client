export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
  status: string;
  roleCount?: number;
};

export type CreateUserRequest = {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roleIDs: string[];
};

export type UpdateUserRequest = {
  userId: string;
  email: string;
  newPassword?: string;
  firstName: string;
  lastName: string;
  roleIDs: string[];
};

export type UpdateUserStatusRequest = {
  isActive: boolean;
};

export type UserListApiResponse = {
  items: User[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageCount?: number;
};

export type UserParams = {
  pageSize?: number;
  orderBy?: string;
  sortDirection?: string;
  searchTerms?: string;
  pageNumber?: number;
};
