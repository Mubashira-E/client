import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type MedicalDepartmentPatchRequest = {
  isActive: boolean;
};

export function usePatchMedicalDepartmentMutation(medicalDepartmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicalDepartmentPatchRequest) =>
      api.patch(
        `${generalEndpoints.patchMedicalDepartment}/${medicalDepartmentId}`,
        data,
        {
          params: { id: medicalDepartmentId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getMedicalDepartment],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getMedicalDepartmentById, medicalDepartmentId],
      });
    },
  });
}
