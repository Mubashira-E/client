import { useQuery } from "@tanstack/react-query";

export function useGetMedicalDepartmentQuery() {
  return useQuery({
    queryKey: ["medical-department-stub"],
    queryFn: () => Promise.resolve({ data: [] }),
    enabled: false,
  });
}
