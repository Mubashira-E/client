import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteItemCategoryMutation(itemCategoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${inventoryEndpoints.deleteItemCategory}/${itemCategoryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getItemCategory],
      });
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getItemCategoryById, itemCategoryId],
      });
    },
  });
}
