import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createInventoryItemSchema = z.object({
  itemName: z.string().trim().min(1, { message: "Item name is required" }),
  itemCategoryId: z.string().trim().optional(),
  unit: z.number().optional(),
  remarks: z.string().trim().default(""),
});

export type CreateInventoryItemRequest = z.infer<typeof createInventoryItemSchema>;

export function useCreateInventoryItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryItemRequest) => api.post(inventoryEndpoints.createInventoryItem, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [inventoryEndpoints.getInventoryItem] });
    },
  });
}
