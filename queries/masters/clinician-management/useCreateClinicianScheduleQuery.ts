import { useMutation } from "@tanstack/react-query";

export function useCreateClinicianScheduleQuery() {
  return useMutation({
    mutationFn: () => Promise.resolve({ data: null }),
  });
}
