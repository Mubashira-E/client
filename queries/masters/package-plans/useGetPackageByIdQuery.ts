import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetPackageByIdQuery(packageId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getPackageById, packageId],
    queryFn: async () => {
      const response = await api.get(`${generalEndpoints.getPackageById}/${packageId}`);
      return response.data;
    },
    enabled: !!packageId,
  });
}
