import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type WellnessProgramResponse = {
  wellnessProgramId: string;
  wellnessProgramCode: string;
  wellnessProgramName: string;
  description: string;
  duration: number;
  durationUnit: string;
  price: number;
  wellnessProgramTreatmentCount: number;
  wellnessProgramPackageCount: number;
  notes: string;
  status: string;
};

type WellnessProgramApiResponse = {
  items: WellnessProgramResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllWellnessProgramQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getWellnessProgram,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<WellnessProgramApiResponse>(generalEndpoints.getWellnessProgram, {
        params: {
          PageSize: params.pageSize || 10,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms?.trim(),
          SortOrderBy: params.sortOrderBy,
        },
      }),
  });

  return {
    ...query,
    wellnessPrograms: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
