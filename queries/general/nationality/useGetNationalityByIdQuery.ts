import type { NationalityResponse } from "./useGetAllNationalityQuery";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetNationalityById(nationalityId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getNationality, nationalityId],
    queryFn: async () => {
      const response = await api.get<NationalityResponse>(
        `${generalEndpoints.getNationality}/${nationalityId}`,
        { params: { id: nationalityId } },
      );
      return response.data;
    },
    enabled: !!nationalityId,
  });
}
