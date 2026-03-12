import { useMutation } from "@tanstack/react-query";

export function useSetClinicianLeaveStatusMutationQuery() {
  return useMutation({
    mutationFn: () => Promise.resolve({ data: null }),
  });
}
