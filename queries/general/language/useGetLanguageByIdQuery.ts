import type { LanguageResponse } from "./useGetAllLanguageQuery";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetLanguageById(languageId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getLanguage, languageId],
    queryFn: async () => {
      const response = await api.get<LanguageResponse>(`${generalEndpoints.getLanguage}/${languageId}`);
      return response.data;
    },
    enabled: !!languageId,
  });
}
