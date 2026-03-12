import type { AxiosResponse } from "axios";
import type { JobListApiResponse } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

function selectJobsData(response: AxiosResponse<JobListApiResponse>) {
  return {
    jobs: response.data.items || [],
    totalPages: response.data.pageCount || 1,
    totalItems: response.data.totalCount || 0,
  };
}

export function useGetAllJobsQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
  jobType?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getJobStatus,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
      params.jobType,
    ],
    queryFn: () =>
      api.get<JobListApiResponse>(generalEndpoints.getJobStatus, {
        params: {
          PageSize: params.pageSize || 10,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms?.trim(),
          SortOrderBy: params.sortOrderBy,
          JobType: params.jobType,
        },
      }),
    refetchInterval: 5000,
    select: selectJobsData,
  });

  return {
    ...query,
    jobs: query.data?.jobs || [],
    totalPages: query.data?.totalPages || 1,
    totalItems: query.data?.totalItems || 0,
  };
}
