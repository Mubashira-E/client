import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type WellnessProgramByIdResponse = {
  wellnessProgramId: string;
  wellnessProgramCode: string;
  wellnessProgramName: string;
  description: string;
  duration: number;
  durationUnit: string;
  price: number;
  notes: string;
  status: string;
  treatments: {
    wellnessProgramTreatmentId: string;
    wellnessProgramId: string;
    treatmentId: string;
    treatmentName: string;
    status: string;
  }[];
  packages: {
    wellnessProgramPackageId: string;
    wellnessProgramId: string;
    packageId: string;
    packageName: string;
    status: string;
  }[];
};

export function useGetWellnessProgramByIdQuery(wellnessProgramId: string) {
  return useQuery({
    queryKey: [generalEndpoints.getWellnessProgram, wellnessProgramId],
    queryFn: async () => {
      const response = await api.get<WellnessProgramByIdResponse>(
        `${generalEndpoints.getWellnessProgramById}/${wellnessProgramId}`,
        { params: { id: wellnessProgramId } },
      );
      return response.data;
    },
    enabled: !!wellnessProgramId,
  });
}
