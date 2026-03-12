import { useQuery } from "@tanstack/react-query";

export function useGetClinicianRotaQuery() {
  return useQuery({
    queryKey: ["clinician-rota-stub"],
    queryFn: () => Promise.resolve({ data: [] }),
    enabled: false,
  });
}
