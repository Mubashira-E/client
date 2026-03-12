import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetClinicianDropdownQuery() {
  return useQuery({
    queryKey: [generalEndpoints.getClinicianDropdown],
    queryFn: async () => {
      const response = await api.get(generalEndpoints.getClinicianDropdown);
      return response.data;
    },
  });
}
