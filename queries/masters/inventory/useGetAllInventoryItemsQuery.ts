import { useQuery } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type InventoryItemResponse = {
  id: string;
  itemName: string;
  itemCategoryId: string;
  category?: string;
  unit: number;
  remarks: string;
  status?: string;
  isActive?: boolean;
};

type InventoryListApiResponse = InventoryItemResponse[] | {
  items: InventoryItemResponse[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageCount?: number;
};

export function useGetAllInventoryItemsQuery() {
  const query = useQuery({
    queryKey: [inventoryEndpoints.getInventoryItem],
    queryFn: async () => {
      const res = await api.get<InventoryListApiResponse>(inventoryEndpoints.getInventoryItem);
      return res.data;
    },
  });

  const data = query.data;
  const items = Array.isArray(data) ? data : data?.items ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.pageCount ?? 1;
  const totalItems = Array.isArray(data) ? items.length : data?.totalCount ?? items.length;

  return { ...query, items, totalPages, totalItems };
}
