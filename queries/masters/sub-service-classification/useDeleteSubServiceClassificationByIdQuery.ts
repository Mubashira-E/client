import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMockSubServiceClassification } from "@/lib/mock-sub-service-classifications";

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useDeleteSubServiceClassificationByIdMutation(options?: MutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const deleted = deleteMockSubServiceClassification(Number(id));
      if (!deleted) {
        throw new Error("Sub service classification not found");
      }
      return deleted;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["sub-service-classifications"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
