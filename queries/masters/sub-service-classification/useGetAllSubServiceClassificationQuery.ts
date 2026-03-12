import { useQuery } from "@tanstack/react-query";
import { getMockSubServiceClassifications } from "@/lib/mock-sub-service-classifications";

type QueryParams = {
  sortColumn?: string;
  searchFilter?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};

export function useGetAllSubServiceClassificationQuery(params: QueryParams = {}) {
  const {
    sortColumn = "subServiceClassification",
    searchFilter = "",
    sortDirection = "asc",
    pageNumber = 1,
    pageSize = 10,
  } = params;

  return useQuery({
    queryKey: ["sub-service-classifications", sortColumn, searchFilter, sortDirection, pageNumber, pageSize],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let data = getMockSubServiceClassifications();

      // Filter by search term
      if (searchFilter) {
        data = data.filter(item =>
          item.subServiceClassification.toLowerCase().includes(searchFilter.toLowerCase())
          || item.serviceClassification.toLowerCase().includes(searchFilter.toLowerCase()),
        );
      }

      // Sort
      data = [...data].sort((a, b) => {
        const aVal = a[sortColumn as keyof typeof a];
        const bVal = b[sortColumn as keyof typeof b];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });

      // Paginate
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = data.slice(startIndex, endIndex);

      return {
        subServiceClassifications: paginatedData,
        totalPages,
        totalItems,
        pageNumber,
        pageSize,
      };
    },
  });
}
