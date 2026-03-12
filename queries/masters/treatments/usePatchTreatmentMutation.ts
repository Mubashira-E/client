import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type TreatmentPatchRequest = {
  isActive: boolean;
};

export function usePatchTreatmentMutation(treatmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TreatmentPatchRequest) =>
      api.patch(
        `${generalEndpoints.patchTreatment}/${treatmentId}`,
        data,
        {
          params: { id: treatmentId },
        },
      ),
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
