import { useQuery } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type ItemCategoryListApiResponse =
  | {
    itemCategoryId: string;
    categoryCode: string;
    categoryName: string;
    description: string;
    status?: string;
    isActive?: boolean;
  }[]
  | {
    items: {
      itemCategoryId: string;
      categoryCode: string;
      categoryName: string;
      description: string;
      status?: string;
      isActive?: boolean;
    }[];
    totalCount?: number;
    page?: number;
    pageSize?: number;
    pageCount?: number;
  };

export function useGetAllItemCategoryQuery() {
  const query = useQuery({
    queryKey: [inventoryEndpoints.getItemCategory],
    queryFn: async () => {
      const response = await api.get<ItemCategoryListApiResponse>(inventoryEndpoints.getItemCategory);
      return response.data;
    },
  });

  const data = query.data;
  const items = Array.isArray(data) ? data : data?.items ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.pageCount ?? 1;
  const totalItems = Array.isArray(data) ? items.length : data?.totalCount ?? items.length;

  return {
    ...query,
    itemCategories: items,
    totalPages,
    totalItems,
  };
}
