import type { UpdateUserRequest, User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await api.put<User>(`${userEndpoints.updateUser}/${data.userId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: [userEndpoints.getUsers] });
      queryClient.invalidateQueries({ queryKey: [userEndpoints.getUserById, variables.userId] });
    },
  });
}
