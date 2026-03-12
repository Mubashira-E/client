import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type TreatmentByIdResponse = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  totalDuration: number;
  totalDurationUnit: string;
  notes: string;
  status: string;
  inventoryItems?: Array<{
    id: string;
    treatmentId: string;
    inventoryItemId: string;
    inventoryItemName: string;
    quantity: number;
    status: string;
  }>;
};

export function useGetTreatmentByIdQuery(treatmentId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getTreatmentById, treatmentId],
    queryFn: async () => {
      const response = await api.get<TreatmentByIdResponse>(`${generalEndpoints.getTreatmentById}/${treatmentId}`);
      return response.data;
    },
    enabled: !!treatmentId,
  });
}
