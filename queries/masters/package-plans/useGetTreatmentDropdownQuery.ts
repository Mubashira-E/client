import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetTreatmentDropdownQuery() {
  return useQuery({
    queryKey: [generalEndpoints.getTreatmentDropdown],
    queryFn: async () => {
      const response = await api.get(generalEndpoints.getTreatmentDropdown);
      return response.data;
    },
  });
}
