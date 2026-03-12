import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteClinicianMutation(clinicianId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${generalEndpoints.deleteClinician}/${clinicianId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getClinician],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getClinicianById, clinicianId],
      });
    },
  });
}
