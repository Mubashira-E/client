import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteTreatmentMutation(treatmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${generalEndpoints.deleteTreatment}/${treatmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatment],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatmentById, treatmentId],
      });
    },
  });
}
