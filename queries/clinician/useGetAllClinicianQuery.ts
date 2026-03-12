import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type ClinicianResponse = {
  clinicianId: string;
  clinicianCode: string;
  clinicianName: string;
  profession: string;
  major: string;
  medicalDepartmentId: string;
  medicalDepartmentName: string;
  languageId?: string;
  languageName?: string;
  nationalityId?: string;
  nationalityName?: string;
  status: string;
};

type ClinicianApiResponse = {
  items: ClinicianResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllClinicianQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
  Status?: number;
  MedicalDepartmentId?: string;
  LanguageId?: string;       // ← new
  NationalityId?: string;    // ← new
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getClinician,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
      params.Status,
      params.MedicalDepartmentId,
      params.LanguageId,
      params.NationalityId,
    ],
    queryFn: () =>
      api.get<ClinicianApiResponse>(generalEndpoints.getClinician, {
        params: {
          PageSize: params.pageSize || 10,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms?.trim(),
          SortOrderBy: params.sortOrderBy,
          Status: params.Status,
          MedicalDepartmentId: params.MedicalDepartmentId,
          LanguageId: params.LanguageId,
          NationalityId: params.NationalityId,
        },
      }),
  });

  return {
    ...query,
    clinicians: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}