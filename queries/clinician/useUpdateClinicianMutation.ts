import type { AxiosError } from "axios";
import type { ClinicianRequest } from "./useCreateClinicianMutation";
import type { ClinicianResponse } from "./useGetAllClinicianQuery";
import type { ApiErrorResponse } from "@/types/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type UseUpdateClinicianMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useUpdateClinicianMutation(
  clinicianId: string,
  options?: UseUpdateClinicianMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClinicianRequest) =>
      api.put<ClinicianResponse>(
        `${generalEndpoints.updateClinician}/${clinicianId}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getClinician] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
