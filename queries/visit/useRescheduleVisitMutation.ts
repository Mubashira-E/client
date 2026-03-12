import { useMutation, useQueryClient } from "@tanstack/react-query";
import { visitEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import type {
  VisitRescheduleRequest,
  VisitRescheduleResponse,
} from "@/types/appointment";

export const useRescheduleVisitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<VisitRescheduleResponse, Error, VisitRescheduleRequest>({
    mutationFn: async (body) => {
      const { data } = await api.put(
        visitEndpoints.rescheduleVisit,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["daily-queue"] });
    },
  });
};
