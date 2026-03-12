import { useQuery } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetItemCategoryByIdQuery(itemCategoryId: string) {
  return useQuery({
    queryKey: [inventoryEndpoints.getItemCategory, itemCategoryId],
    queryFn: async () => {
      const response = await api.get<{
        itemCategoryId: string;
        categoryCode: string;
        categoryName: string;
        description: string;
      }>(`${inventoryEndpoints.getItemCategoryById}/${itemCategoryId}`, {
        params: { id: itemCategoryId },
      });
      return response.data;
    },
    enabled: !!itemCategoryId,
  });
}
