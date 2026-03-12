import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteInventoryItemMutation(inventoryItemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${inventoryEndpoints.deleteInventoryItem}/${inventoryItemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getInventoryItem],
      });
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getInventoryItemById, inventoryItemId],
      });
    },
  });
}
