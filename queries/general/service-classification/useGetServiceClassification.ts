import { useQuery } from "@tanstack/react-query";
import { getMockServiceClassifications } from "@/lib/mock-service-classifications";

type QueryParams = {
  pageSize?: number;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
};

export function useGetServiceClassificationQuery(params: QueryParams = {}) {
  const { pageSize = 10, sortDirection = "asc", pageNumber = 1 } = params;

  return useQuery({
    queryKey: ["service-classifications", pageSize, sortDirection, pageNumber],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let data = getMockServiceClassifications();

      // Sort
      data = [...data].sort((a, b) => {
        return sortDirection === "asc"
          ? a.serviceClassification.localeCompare(b.serviceClassification)
          : b.serviceClassification.localeCompare(a.serviceClassification);
      });

      // Paginate
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = data.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        totalPages,
        totalItems,
        pageNumber,
        pageSize,
      };
    },
  });
}
