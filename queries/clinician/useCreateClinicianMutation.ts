import type { AxiosError } from "axios";
import type { ClinicianResponse } from "./useGetAllClinicianQuery";
import type { ApiErrorResponse } from "@/types/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createClinicianSchema = z.object({
  clinicianCode: z.string().trim().min(1, { message: "Clinician code is required." }),
  clinician: z.string().trim().min(2, { message: "Clinician name must be at least 2 characters." }),
  profession: z.string().trim().optional(),
  major: z.string().trim().optional(),
  medicalDepartmentId: z.string().uuid({ message: "Valid medical department ID is required." }),
});

export type ClinicianRequest = z.infer<typeof createClinicianSchema>;

type UseCreateClinicianMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useCreateClinicianMutation(options?: UseCreateClinicianMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClinicianRequest) =>
      api.post<ClinicianResponse>(generalEndpoints.createClinician, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getClinician],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
