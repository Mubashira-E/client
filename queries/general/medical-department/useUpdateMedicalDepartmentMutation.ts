import type { MedicalDepartmentRequest } from "./useCreateMedicalDepartmentMutationQuery";
import type { MedicalDepartmentResponse } from "./useGetAllMedicalDepartmentQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useUpdateMedicalDepartmentMutation(medicalDepartmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicalDepartmentRequest) =>
      api.put<MedicalDepartmentResponse>(`${generalEndpoints.getMedicalDepartmentById}/${medicalDepartmentId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getMedicalDepartment],
      });
    },
  });
}
