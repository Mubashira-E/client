import { useQuery } from "@tanstack/react-query";

export function useGetFacilityListQuery() {
  return useQuery({
    queryKey: ["facility-list-stub"],
    queryFn: () => Promise.resolve({ data: [] }),
    enabled: false,
  });
}
