import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type TreatmentResponse = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  totalDuration: number;
  totalDurationUnit: string;
  notes: string;
  status: string;
};

type TreatmentApiResponse = {
  items: TreatmentResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
  Status?: number;
};

export function useGetAllTreatmentQuery(params: {
  PageSize?: number;
  SortOrderBy?: boolean;
  SearchTerms?: string;
  PageNumber?: number;
  Status?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getTreatment,
      params.PageNumber,
      params.SearchTerms,
      params.SortOrderBy,
      params.Status,
    ],
    queryFn: () =>
      api.get<TreatmentApiResponse>(generalEndpoints.getTreatment, {
        params: {
          PageSize: params.PageSize || 10,
          PageNumber: params.PageNumber,
          SearchTerms: params.SearchTerms?.trim(),
          SortOrderBy: params.SortOrderBy,
          Status: params.Status,
        },
      }),
  });

  return {
    ...query,
    treatments: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
    currentPage: query.data?.data.page || 1,
  };
}
