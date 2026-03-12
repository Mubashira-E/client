import { useMutation } from "@tanstack/react-query";

export function useDeleteClinicianLicenseByIdQuery() {
  return useMutation({
    mutationFn: () => Promise.resolve({ data: null }),
  });
}
