import type { createInventoryItemSchema } from "./useCreateInventoryItemMutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type UpdateInventoryItemRequest = typeof createInventoryItemSchema["_input"];

export function useUpdateInventoryItemMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInventoryItemRequest) =>
      api.put(`${inventoryEndpoints.updateInventoryItem}/${id}`, data, { params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [inventoryEndpoints.getInventoryItem] });
    },
  });
}
