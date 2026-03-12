import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeletePackageMutation(packageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${generalEndpoints.deletePackage}/${packageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackageById, packageId],
      });
    },
  });
}
