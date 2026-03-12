import { useQuery } from "@tanstack/react-query";
import { getMockSubServiceClassifications } from "@/lib/mock-sub-service-classifications";

export function useGetSubServiceClassificationByIdQuery(id: string) {
  return useQuery({
    queryKey: ["sub-service-classification-by-id", id],
    queryFn: async () => {
      if (!id)
        return null;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const data = getMockSubServiceClassifications();
      const item = data.find(x => x.subServiceClassificationId === Number(id));

      if (!item) {
        throw new Error("Sub service classification not found");
      }

      return item;
    },
    enabled: !!id,
  });
}
