import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteWellnessProgramMutation(wellnessProgramId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${generalEndpoints.deleteWellnessProgram}/${wellnessProgramId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getWellnessProgram],
      });
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getWellnessProgramById, wellnessProgramId],
      });
    },
  });
}
