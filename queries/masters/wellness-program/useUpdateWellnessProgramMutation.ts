import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const updateWellnessProgramSchema = z.object({
  wellnessProgramCode: z.string().trim().min(1, { message: "Wellness Program Code is required" }),
  wellnessProgramName: z.string().trim().min(1, { message: "Wellness Program Name is required" }),
  description: z.string().trim().optional(),
  duration: z.number().min(0, { message: "Duration must be 0 or greater" }).optional(),
  durationUnit: z.number().min(0, { message: "Duration unit is required" }).optional(),
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
  notes: z.string().trim().optional(),
  treatmentIds: z.array(z.object({
    id: z.string(),
    treatmentId: z.string(),
    isActive: z.boolean(),
  })).optional(),
  packageIds: z.array(z.object({
    id: z.string(),
    packageId: z.string(),
    isActive: z.boolean(),
  })).optional(),
}).superRefine((data, ctx) => {
  const hasTreatments = (data.treatmentIds?.length ?? 0) > 0;
  const hasPackages = (data.packageIds?.length ?? 0) > 0;

  if (!hasTreatments && !hasPackages) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one package or treatment",
      path: ["treatmentIds"],
    });
  }
});

export type WellnessProgramUpdateRequest = z.infer<typeof updateWellnessProgramSchema>;

export function useUpdateWellnessProgramMutation(wellnessProgramId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WellnessProgramUpdateRequest) =>
      api.put(
        `${generalEndpoints.updateWellnessProgram}/${wellnessProgramId}`,
        data,
        {
          params: { id: wellnessProgramId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getWellnessProgram],
      });
    },
  });
}
