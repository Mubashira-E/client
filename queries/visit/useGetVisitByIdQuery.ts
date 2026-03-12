import type { VisitDetails } from "@/types/visit";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetVisitByIdQuery(visitId: string) {
  const query = useQuery({
    queryKey: [generalEndpoints.getVisitById, visitId],
    queryFn: () =>
      api.get<VisitDetails>(`${generalEndpoints.getVisitById}/${visitId}`),
    enabled: !!visitId,
  });

  return {
    ...query,
    visitDetails: query.data?.data,
  };
}
