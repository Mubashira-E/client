import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteMedicalDepartmentMutation(medicalDepartmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${generalEndpoints.deleteMedicalDepartment}/${medicalDepartmentId}`),
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
