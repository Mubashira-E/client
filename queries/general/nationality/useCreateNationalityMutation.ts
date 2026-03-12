import type { NationalityResponse } from "./useGetAllNationalityQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createNationalitySchema = z.object({
  nationality: z.string().trim().min(2, { message: "Nationality must be at least 2 characters." }),
  nationalityCode: z.string().trim().min(1, { message: "Nationality code must be at least 1 character." }),
});

export type NationalityRequest = z.infer<typeof createNationalitySchema>;

export function useCreateNationalityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NationalityRequest) =>
      api.post<NationalityResponse>(generalEndpoints.getNationality, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getNationality],
      });
    },
  });
}
