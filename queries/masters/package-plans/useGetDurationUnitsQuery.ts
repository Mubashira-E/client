import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetDurationUnitsQuery() {
  return useQuery({
    queryKey: [generalEndpoints.getDurationUnits],
    queryFn: async () => {
      const response = await api.get(generalEndpoints.getDurationUnits);
      return response.data;
    },
  });
}
