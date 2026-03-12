import { useQuery } from "@tanstack/react-query";
import { visitEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import type { GetDailyQueueResponse } from "@/types/appointment";

interface DailyQueueParams {
  date?:        string;  
  clinicianId?: string;
}

export const useGetDailyQueueQuery = (params: DailyQueueParams = {}) => {
  const { date, clinicianId } = params;

  return useQuery<GetDailyQueueResponse[]>({
    queryKey: ["daily-queue", date, clinicianId],
    queryFn:  async () => {
      const { data } = await api.get(
        visitEndpoints.getDailyQueue,
        { params: { date, clinicianId } }
      );
      return data.data ?? data;
    },
    refetchInterval: 60_000,
  });
};
