import type { MedicalDepartmentResponse } from "./useGetAllMedicalDepartmentQuery";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetMedicalDepartmentByIdQuery(medicalDepartmentId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getMedicalDepartmentById, medicalDepartmentId],
    queryFn: async () => {
      const response = await api.get<MedicalDepartmentResponse>(`${generalEndpoints.getMedicalDepartmentById}/${medicalDepartmentId}`);
      return response.data;
    },
    enabled: !!medicalDepartmentId,
  });
}
