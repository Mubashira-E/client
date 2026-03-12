import type { PermissionResponse } from "@/types/role";
import { useQuery } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type PermissionsApiResponse = {
  permissions: PermissionResponse[];
};

export function useGetAllPermissionsQuery() {
  const query = useQuery({
    queryKey: [roleEndpoints.getPermissions],
    queryFn: () => api.get<PermissionsApiResponse>(roleEndpoints.getPermissions),
  });

  const rawData = query.data?.data;
  const permissions = rawData?.permissions || [];

  return {
    ...query,
    permissions,
  };
}
