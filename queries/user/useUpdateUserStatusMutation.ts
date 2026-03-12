import type { UpdateUserStatusRequest, User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserStatusRequest }) => {
      const response = await api.patch<User>(`${userEndpoints.updateUserStatus}/${id}/status`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: [userEndpoints.getUsers] });
      queryClient.invalidateQueries({ queryKey: [userEndpoints.getUserById, variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update user status");
    },
  });
}
