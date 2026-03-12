import type { AxiosResponse } from "axios";
import type { PatientDetails } from "@/types/patient";
import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

function selectPatientData(response: AxiosResponse<PatientDetails>) {
  return response.data;
}

export function useGetPatientByIdQuery(patientId: string) {
  const query = useQuery({
    queryKey: [generalEndpoints.getPatientById, patientId],
    queryFn: () =>
      api.get<PatientDetails>(`${generalEndpoints.getPatientById}/${patientId}`),
    enabled: !!patientId,
    select: selectPatientData,
  });

  return {
    ...query,
    patientDetails: query.data,
  };
}
