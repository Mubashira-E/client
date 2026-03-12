import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { addMockSubServiceClassification, getMockSubServiceClassifications } from "@/lib/mock-sub-service-classifications";

export const createSubServiceClassificationSchema = z.object({
  subServiceClassification: z.string().min(1, "Sub service classification name is required"),
  serviceClassificationID: z.number().min(1, "Service classification is required"),
  isDrug: z.boolean(),
  vatPercentage: z.number().min(0).max(100),
});

export type CreateSubServiceClassificationPayload = z.infer<typeof createSubServiceClassificationSchema>;

export function useCreateSubServiceClassificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSubServiceClassificationPayload) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get current data to find max ID
      const currentData = getMockSubServiceClassifications();
      const maxId = currentData.length > 0 ? Math.max(...currentData.map(item => item.subServiceClassificationId)) : 0;

      // Create new item
      const newItem = {
        subServiceClassificationId: maxId + 1,
        subServiceClassification: payload.subServiceClassification,
        serviceClassification: "Medical Services", // Default for mock
        serviceClassificationId: payload.serviceClassificationID.toString(),
        isDrug: payload.isDrug,
        status: true,
        vatPercentage: payload.vatPercentage,
      };

      addMockSubServiceClassification(newItem);
      return newItem;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["sub-service-classifications"] });
    },
  });
}
