import type { CreateSubServiceClassificationPayload } from "./useCreateSubServiceClassificationMutationQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMockSubServiceClassification } from "@/lib/mock-sub-service-classifications";

type UpdatePayload = CreateSubServiceClassificationPayload & {
  id: string;
};

export function useUpdateSubServiceClassificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updated = updateMockSubServiceClassification(Number(payload.id), {
        subServiceClassification: payload.subServiceClassification,
        serviceClassificationId: payload.serviceClassificationID.toString(),
        isDrug: payload.isDrug,
        vatPercentage: payload.vatPercentage,
      });

      if (!updated) {
        throw new Error("Sub service classification not found");
      }

      return updated;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["sub-service-classifications"] });
      queryClient.invalidateQueries({ queryKey: ["sub-service-classification-by-id"] });
    },
  });
}
