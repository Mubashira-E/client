import type { AxiosError } from "axios";
import type { UpdateRoleRequest } from "@/types/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type UseUpdateRoleMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function useUpdateRoleMutation(roleId: string, options?: UseUpdateRoleMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => {
      return api.put(`${roleEndpoints.updateRole}/${roleId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
      queryClient.invalidateQueries({ queryKey: [roleEndpoints.getRole] });
      queryClient.invalidateQueries({ queryKey: [roleEndpoints.getRoleById, roleId] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
