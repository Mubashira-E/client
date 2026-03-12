import { useMutation, useQueryClient } from "@tanstack/react-query";
import { visitEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import type {
  VisitStatusChangeRequest,
  VisitStatusChangeResponse,
} from "@/types/appointment";

export const useChangeVisitStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<VisitStatusChangeResponse, Error, VisitStatusChangeRequest>({
    mutationFn: async (body) => {
      const { data } = await api.patch(
        visitEndpoints.changeStatus,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-queue"] });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};