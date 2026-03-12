import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetRoomTypeDropdownQuery() {
  return useQuery({
    queryKey: [generalEndpoints.getRoomTypeDropdown],
    queryFn: async () => {
      const response = await api.get(generalEndpoints.getRoomTypeDropdown);
      return response.data;
    },
  });
}
