import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createTreatmentSchema = z.object({
  code: z.string().trim().min(1, { message: "Treatment code must be at least 1 character." }),
  name: z.string().trim().min(2, { message: "Treatment name must be at least 2 characters." }),
  description: z.string().trim().optional(),
  price: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Price must be greater than or equal to 0." }),
  ) as unknown as z.ZodNumber,
  duration: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration per session must be greater than 0." }),
  ) as unknown as z.ZodNumber,
  durationUnit: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration unit is required." }),
  ) as unknown as z.ZodNumber,
  notes: z.string().trim().optional(),
  inventoryItems: z.array(
    z.object({
      inventoryItemId: z.string().trim().min(1, { message: "Inventory item is required." }),
      quantity: z.preprocess(
        val => (val === "" ? undefined : Number(val)),
        z.number().min(1, { message: "Quantity must be greater than 0." }),
      ) as unknown as z.ZodNumber,
    }),
  ).optional(),
});

export type TreatmentRequest = z.infer<typeof createTreatmentSchema>;

type TreatmentCreateResponse = {
  status: string;
  message: string;
  data: {
    status: string;
    treatmentId: string;
    treatmentName: string;
    treatmentCode: string;
    description: string;
    totalDuration?: string;
    price: number;
    duration: number;
    recommendedSessions: number;
    preferredTherapists?: string[];
    requiredRoomType?: string[];
    associatedInventoryItems?: Array<{
      inventoryItemId: string;
      quantity: number;
    }>;
    notes?: string;
  };
};

type ApiErrorResponse = {
  message?: string;
  detail?: string;
  errors?: Array<{ property: string; message: string }>;
};

type UseCreateTreatmentMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useCreateTreatmentMutation(options?: UseCreateTreatmentMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TreatmentRequest) => {
      return api.post<TreatmentCreateResponse>(generalEndpoints.createTreatment, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatment],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
