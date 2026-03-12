import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMockSubServiceClassificationStatus } from "@/lib/mock-sub-service-classifications";

export function usePatchSubServiceClassificationByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updated = toggleMockSubServiceClassificationStatus(Number(id));
      if (!updated) {
        throw new Error("Sub service classification not found");
      }
      return updated;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["sub-service-classifications"] });
    },
  });
}
