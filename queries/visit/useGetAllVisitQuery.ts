import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type VisitListItem = {
  visitId: string;
  visitNo: number;
  patientId: string;
  patientName: string;
  emrNumber: string;
  visitDate: string;
  medicalDepartmentId: string;
  medicalDepartmentName: string;
  clinicianId: string;
  clinicianName: string;
  visitType: string;
  status: string; // "Scheduled" | "Arrived" | "Completed" | "Cancelled"
  startTime?: string; // for slot time display
  mobileNumber?: string; // patient mobile
};

type VisitListApiResponse = {
  items: VisitListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllVisitQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getVisit,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<VisitListApiResponse>(generalEndpoints.getVisit, {
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
    visits: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}