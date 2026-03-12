import type { AxiosError } from "axios";
import type { PatchRoleStatusRequest } from "@/types/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type UsePatchRoleStatusMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function usePatchRoleStatusMutation(roleId: string, options?: UsePatchRoleStatusMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchRoleStatusRequest) =>
      api.patch(`${roleEndpoints.patchRoleStatus}/${roleId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roleEndpoints.getRole] });
      queryClient.invalidateQueries({ queryKey: [roleEndpoints.getRoleById, roleId] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
