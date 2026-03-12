import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type PatchPackageRequest = {
  isActive: boolean;
};

type UsePatchPackageMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function usePatchPackageMutation(packageId: string, options?: UsePatchPackageMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchPackageRequest) => {
      return api.patch(`${generalEndpoints.patchPackage}/${packageId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getPackage] });
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getPackageById, packageId] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
