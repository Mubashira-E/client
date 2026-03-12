import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type PatientListItem = {
  patientId: string;
  emrNumber: string;
  patientName: string;
  age: number;
  nationalityId: string;
  nationalityName: string;
  emiratesId: string;
  mobile?: string;
  gender?: string;
};

type PatientListApiResponse = {
  items: PatientListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllPatientQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
  // When true, uses /api/v1/patient/search which filters by EMR/Mobile/Emirates
  useSearch?: boolean;
}) {
  // /api/v1/patient/search  — returns PatientSearchResponse (emrNumber, mobile, emiratesId, gender)
  // /api/v1/patient         — returns PatientGetAllResponse  (general list)
  const endpoint = params.useSearch && params.searchTerms
    ? `${generalEndpoints.getPatient}/search`
    : generalEndpoints.getPatient;

  const query = useQuery({
    queryKey: [endpoint, params.pageNumber, params.searchTerms, params.sortOrderBy],
    queryFn: () =>
      api.get<PatientListApiResponse>(endpoint, {
        params: {
          PageSize: params.pageSize || 10,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms?.trim(),
          SortOrderBy: params.sortOrderBy,
        },
      }),
    // Only run search query when there is a search term
    enabled: params.useSearch ? Boolean(params.searchTerms) : true,
  });

  return {
    ...query,
    patients: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
