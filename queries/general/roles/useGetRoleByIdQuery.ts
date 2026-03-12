import type { RoleDetailResponse } from "@/types/role";
import { useQuery } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetRoleByIdQuery(roleId: string) {
  return useQuery({
    queryKey: [roleEndpoints.getRoleById, roleId],
    queryFn: async () => {
      const response = await api.get<RoleDetailResponse>(`${roleEndpoints.getRoleById}/${roleId}`);
      return response.data;
    },
    enabled: !!roleId,
  });
}
