import type { MedicalDepartmentResponse } from "./useGetAllMedicalDepartmentQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createMedicalDepartmentSchema = z.object({
  medicalDepartmentName: z
    .string()
    .trim()
    .min(2, { message: "Medical Department must be at least 2 characters." }),
});

export type MedicalDepartmentRequest = z.infer<typeof createMedicalDepartmentSchema>;

export function useCreateMedicalDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicalDepartmentRequest) =>
      api.post<MedicalDepartmentResponse>(generalEndpoints.createMedicalDepartment, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getMedicalDepartment],
      });
    },
  });
}
