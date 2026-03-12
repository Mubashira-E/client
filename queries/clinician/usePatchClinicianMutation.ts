import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type ClinicianPatchRequest = {
  isActive: boolean;
};

export function usePatchClinicianMutation(clinicianId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClinicianPatchRequest) =>
      api.patch(
        `${generalEndpoints.patchClinician}/${clinicianId}`,
        data,
        {
          params: { id: clinicianId },
        },
      ),
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
