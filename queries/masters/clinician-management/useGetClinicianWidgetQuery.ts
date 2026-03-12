import { useQuery } from "@tanstack/react-query";

export function useGetClinicianWidgetQuery() {
  return useQuery({
    queryKey: ["clinician-widget-stub"],
    queryFn: () => Promise.resolve({ data: { totalClinicians: 0, activeClinicians: 0, inactiveClinicians: 0 } }),
  });
}
