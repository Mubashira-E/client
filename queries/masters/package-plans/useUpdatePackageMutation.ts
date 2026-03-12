import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type PackageUpdateRequest = {
  packageCode: string;
  packageName: string;
  price: number;
  description: string;
  duration: number;
  durationUnit: number;
  notes: string;
  treatmentIds: Array<{
    id?: string;
    treatmentId: string;
    price?: number;
    isActive: boolean;
  }>;
};

type UseUpdatePackageMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function useUpdatePackageMutation(packageId: string, options?: UseUpdatePackageMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PackageUpdateRequest) => {
      return api.put(`${generalEndpoints.updatePackage}/${packageId}`, data);
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
