import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type TreatmentUpdateRequest = {
  code: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: number;
  notes: string;
  inventoryItems: Array<{
    id?: string;
    inventoryItemId: string;
    quantity: number;
    isActive: boolean;
  }>;
};

type TreatmentUpdateResponse = {
  status: string;
  message: string;
  data: {
    status: string;
    treatmentId: string;
    treatmentName: string;
    treatmentCode: string;
    description: string;
    price: number;
    duration: number;
    durationUnit: string;
    notes?: string;
  };
};

type ApiErrorResponse = {
  message?: string;
  detail?: string;
  errors?: Array<{ property: string; message: string }>;
};

type UseUpdateTreatmentMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useUpdateTreatmentMutation(treatmentId: string, options?: UseUpdateTreatmentMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TreatmentUpdateRequest) => {
      return api.put<TreatmentUpdateResponse>(`${generalEndpoints.updateTreatment}/${treatmentId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getTreatment] });
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getTreatmentById, treatmentId] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
