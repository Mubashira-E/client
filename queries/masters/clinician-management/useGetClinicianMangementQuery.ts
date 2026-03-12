import { useQuery } from "@tanstack/react-query";

export function useGetClinicianMangementQuery() {
  return useQuery({
    queryKey: ["clinician-management-stub"],
    queryFn: () => Promise.resolve({ data: [], totalPages: 0, totalItems: 0 }),
    enabled: false,
  });
}
