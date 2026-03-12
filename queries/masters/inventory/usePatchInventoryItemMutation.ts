import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type InventoryItemPatchRequest = {
  isActive: boolean;
};

export function usePatchInventoryItemMutation(inventoryItemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InventoryItemPatchRequest) =>
      api.patch(
        `${inventoryEndpoints.patchInventoryItem}/${inventoryItemId}`,
        data,
        {
          params: { id: inventoryItemId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getInventoryItem],
      });
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getInventoryItem, inventoryItemId],
      });
    },
  });
}
