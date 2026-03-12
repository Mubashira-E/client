import type { NationalityResponse } from "./useGetAllNationalityQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const updateNationalitySchema = z.object({
  nationalityName: z.string().trim().min(2, { message: "Nationality must be at least 2 characters." }),
  nationalityCode: z.string().trim().min(1, { message: "Nationality code must be at least 1 character." }),
});

export type NationalityUpdateRequest = z.infer<typeof updateNationalitySchema>;

export function useUpdateNationalityMutation(nationalityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NationalityUpdateRequest) =>
      api.put<NationalityResponse>(
        `${generalEndpoints.getNationality}/${nationalityId}`,
        {
          ...data,
          NationalityId: nationalityId,
        },
        {
          params: { id: nationalityId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getNationality],
      });
    },
  });
}
