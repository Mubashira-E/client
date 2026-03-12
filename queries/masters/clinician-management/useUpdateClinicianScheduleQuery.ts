import { useMutation } from "@tanstack/react-query";

export function useUpdateClinicianScheduleQuery() {
  return useMutation({
    mutationFn: () => Promise.resolve({ data: null }),
  });
}
