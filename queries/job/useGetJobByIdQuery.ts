import type { AxiosResponse } from "axios";
import type { JobDetails } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

function selectJobData(response: AxiosResponse<JobDetails>) {
  return response.data;
}

export function useGetJobByIdQuery(jobId: string) {
  const query = useQuery({
    queryKey: [generalEndpoints.getJobById, jobId],
    queryFn: () =>
      api.get<JobDetails>(`${generalEndpoints.getJobById}/${jobId}`),
    enabled: !!jobId,
    select: selectJobData,
  });

  return {
    ...query,
    jobDetails: query.data,
  };
}
