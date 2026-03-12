import { useQuery } from "@tanstack/react-query";

type ScheduleData = {
  scheduledDate: string;
  [key: string]: any;
};

export function useGetScheduleInformationForClinicianQuery(params?: any) {
  const query = useQuery({
    queryKey: ["schedule-information-stub", params],
    queryFn: () => Promise.resolve({ data: { schedules: [] as ScheduleData[] } }),
    enabled: false,
  });

  return {
    schedules: [] as ScheduleData[],
    ...query,
  };
}
