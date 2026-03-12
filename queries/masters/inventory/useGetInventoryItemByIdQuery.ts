import type { InventoryItemResponse } from "./useGetAllInventoryItemsQuery";
import { useQuery } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetInventoryItemByIdQuery(id: string) {
  return useQuery({
    queryKey: [inventoryEndpoints.getInventoryItem, id],
    queryFn: async () => {
      const res = await api.get<InventoryItemResponse>(`${inventoryEndpoints.getInventoryItem}/${id}`, { params: { id } });
      return res.data;
    },
    enabled: !!id,
  });
}
