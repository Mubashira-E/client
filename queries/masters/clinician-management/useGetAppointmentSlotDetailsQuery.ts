import { useQuery } from "@tanstack/react-query";

export function useGetAppointmentSlotDetailsQuery() {
  return useQuery({
    queryKey: ["appointment-slot-details-stub"],
    queryFn: () => Promise.resolve({ data: null }),
    enabled: false,
  });
}
