import type { CreateUserRequest, User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await api.post<User>(userEndpoints.createUser, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: [userEndpoints.getUsers] });
    },
  });
}
