import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type MedicalDepartmentResponse = {
  medicalDepartmentId: string;
  medicalDepartmentName: string;
  status: string;
};

type MedicalDepartmentApiResponse = {
  items: MedicalDepartmentResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllMedicalDepartmentQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getMedicalDepartment,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<MedicalDepartmentApiResponse>(generalEndpoints.getMedicalDepartment, {
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
    medicalDepartments: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
