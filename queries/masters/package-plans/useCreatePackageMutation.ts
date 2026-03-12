import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createPackageSchema = z.object({
  packageCode: z.string().trim().optional(),
  packageName: z.string().trim().min(1, { message: "Package name is required" }),
  price: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Price must be greater than or equal to 0" }),
  ) as unknown as z.ZodNumber,
  description: z.string().trim().optional(),
  duration: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration must be greater than 0" }),
  ) as unknown as z.ZodNumber,
  durationUnit: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration unit is required" }),
  ) as unknown as z.ZodNumber,
  notes: z.string().trim().optional(),
  treatmentIds: z.array(
    z.object({
      treatmentId: z.string().trim().min(1, { message: "Treatment ID is required" }),
    }),
  ).min(1, { message: "Select at least one treatment" }),
});

export type PackageRequest = z.infer<typeof createPackageSchema>;

type UseCreatePackageMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
};

export function useCreatePackageMutation(options?: UseCreatePackageMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PackageRequest) => {
      return api.post(generalEndpoints.createPackage, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => {
      options?.onError?.(error);
    },
  });
}
