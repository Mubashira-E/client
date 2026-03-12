import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type WellnessProgramPatchRequest = {
  isActive: boolean;
};

export function usePatchWellnessProgramMutation(wellnessProgramId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WellnessProgramPatchRequest) =>
      api.patch(
        `${generalEndpoints.patchWellnessProgram}/${wellnessProgramId}`,
        data,
        {
          params: { id: wellnessProgramId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getWellnessProgram],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getWellnessProgram, wellnessProgramId],
      });
    },
  });
}
