import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { userEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetUserByIdQuery(id: string) {
  return useQuery({
    queryKey: [userEndpoints.getUserById, id],
    queryFn: async () => {
      const response = await api.get<User>(`${userEndpoints.getUserById}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
