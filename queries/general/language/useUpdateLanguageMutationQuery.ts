import type { AxiosError } from "axios";
import type { LanguageRequest } from "./useCreateLanguageMutationQuery";
import type { LanguageResponse } from "./useGetAllLanguageQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type ApiErrorResponse = {
  message: string;
  errors?: Array<{ property: string; message: string }>;
};

type UseUpdateLanguageMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
};

export function useUpdateLanguageMutation(languageId: string, options?: UseUpdateLanguageMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LanguageRequest) =>
      api.put<LanguageResponse>(`${generalEndpoints.updateLanguage}/${languageId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [generalEndpoints.getLanguage] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
