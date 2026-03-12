import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type UseDeleteRoleMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function useDeleteRoleMutation(roleId: string, options?: UseDeleteRoleMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${roleEndpoints.deleteRole}/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
      queryClient.invalidateQueries({
        queryKey: [roleEndpoints.getRole],
      });
      queryClient.invalidateQueries({
        queryKey: [roleEndpoints.getRoleById, roleId],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
