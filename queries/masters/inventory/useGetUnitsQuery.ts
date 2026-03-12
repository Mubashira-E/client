import { useQuery } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type UnitResponse = {
  id: number;
  name: string;
};

export function useGetUnitsQuery() {
  return useQuery({
    queryKey: [inventoryEndpoints.getUnits],
    queryFn: async () => {
      const res = await api.get<UnitResponse[]>(inventoryEndpoints.getUnits);
      return res.data;
    },
  });
}
