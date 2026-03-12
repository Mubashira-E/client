import type { ClinicianResponse } from "./useGetAllClinicianQuery";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type ClinicianByIdResponse = ClinicianResponse & {
  clinician?: string;
};

export function useGetClinicianByIdQuery(clinicianId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getClinicianById, clinicianId],
    queryFn: async () => {
      const response = await api.get<ClinicianByIdResponse>(
        `${generalEndpoints.getClinicianById}/${clinicianId}`,
      );
      return response.data;
    },
    enabled: !!clinicianId,
  });
}
