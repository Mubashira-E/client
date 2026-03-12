import type { AxiosError } from "axios";
import type { LanguageResponse } from "./useGetAllLanguageQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createLanguageSchema = z.object({
  languageName: z.string().trim().min(2, { message: "Language must be at least 2 characters." }),
  languageCode: z.string().trim().min(1, { message: "Code must be at least 1 character." }),
});

export type LanguageRequest = z.infer<typeof createLanguageSchema>;

type ApiErrorResponse = {
  message: string;
  errors?: Array<{ property: string; message: string }>;
};

type UseCreateLanguageMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useCreateLanguageMutation(options?: UseCreateLanguageMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LanguageRequest) =>
      api.post<LanguageResponse>(generalEndpoints.createLanguage, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getLanguage],
      });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
