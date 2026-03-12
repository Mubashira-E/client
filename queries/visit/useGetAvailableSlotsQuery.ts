import { useQuery } from "@tanstack/react-query";
import { visitEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type AvailableSlotsResponse = {
  timeSlot: string;    // e.g. "09:00 AM - 09:30 AM"
  startTime: string;   // ISO DateTime string
  endTime: string;     // ISO DateTime string
  isAvailable: boolean;
};

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

type SlotsParams = {
  clinicianId: string | undefined;
  date: string | undefined;       // "yyyy-MM-dd"
  treatmentId?: string | undefined;
  roomId?: string | undefined;
};

export function useGetAvailableSlotsQuery({ clinicianId, date, treatmentId, roomId }: SlotsParams) {
  const isValidTreatment = treatmentId && treatmentId !== EMPTY_GUID;

  return useQuery<AvailableSlotsResponse[]>({
    queryKey: ["slots", clinicianId, date, treatmentId, roomId],
    queryFn: async () => {
      const response = await api.get(visitEndpoints.getAvailableSlots, {
        params: {
          clinicianId,
          date,
          ...(isValidTreatment ? { treatmentId } : {}),
          ...(roomId ? { roomId } : {}),
        },
      });
      return response.data?.data ?? response.data ?? [];
    },
    // KEY: requires clinicianId AND date — both only exist after visitDetails loads.
    // This prevents a premature 401 request on page mount that redirects to login.
    enabled: !!(clinicianId && date),
    staleTime: 30_000,
  });
}