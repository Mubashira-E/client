export type RoleResponse = {
  roleId: string;
  name: string;
  description: string;
  notes?: string;
  status: string;
  roleType?: string;
  userCount?: number;
};

export type RoleDetailResponse = {
  roleId: string;
  name: string;
  description: string;
  notes: string;
  status: string;
  permissions: PermissionResponse[];
};

export type PermissionResponse = {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  permissionId: string;
  action: string;
};

export type CreateRoleRequest = {
  name: string;
  description: string;
  notes: string;
  permissionIds: string[];
};

export type UpdateRoleRequest = {
  name: string;
  description: string;
  notes: string;
  permissionIds: string[];
};

export type PatchRoleStatusRequest = {
  isActive: boolean;
};

export type RoleListApiResponse = {
  items: RoleResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
