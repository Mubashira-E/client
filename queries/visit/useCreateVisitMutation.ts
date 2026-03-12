import type { CreateVisitRequest } from "@/app/(protected)/appointments/book-appointment/schema/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { visitEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type CreateVisitResponse = {
  visitId: string;
  isSuccess: boolean;
  message: string;
};

export function useCreateVisitMutation() {
  const queryClient = useQueryClient();

  
  return useMutation<CreateVisitResponse, any, CreateVisitRequest>({
    mutationFn: async (body) => {
      const { data } = await api.post<CreateVisitResponse>(
        visitEndpoints.createVisit,
        body,
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.isSuccess) return; // business error — handled by caller
      // Refresh visit list, slots, and daily queue
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["daily-queue"] });
    },
  });
}