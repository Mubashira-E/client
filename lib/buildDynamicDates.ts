import { addDays, format } from "date-fns";

export type DynamicDate = {
  id: string;
  label: string;
  date: Date;
};

/**
 * Builds the date-pill list used by SlotSelection, ClinicianDetailContainer,
 * and RoomAllocationFlow. Kept in its own file so it can be imported by
 * multiple components without triggering react-refresh/only-export-components.
 *
 * Place this file at: src/lib/buildDynamicDates.ts
 */
export function buildDynamicDates(): DynamicDate[] {
  const today = new Date();
  const dates: DynamicDate[] = [
    { id: "today", label: "Today", date: today },
    { id: "tomorrow", label: "Tomorrow", date: addDays(today, 1) },
  ];
  for (let i = 2; i < 9; i++) {
    const date = addDays(today, i);
    dates.push({
      id: `day-${i}`,
      label: `${format(date, "d")} ${format(date, "EEE")} ${format(date, "MMM")}`,
      date,
    });
  }
  return dates;
}
