import type { AxiosError } from "axios";
import type { CreateRoleRequest } from "@/types/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  permissionIds: z.array(z.string().uuid()).min(1, { message: "Select at least one permission" }),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

type UseCreateRoleMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function useCreateRoleMutation(options?: UseCreateRoleMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => {
      return api.post(roleEndpoints.createRole, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-details"],
      });
      queryClient.invalidateQueries({
        queryKey: [roleEndpoints.getRole],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
