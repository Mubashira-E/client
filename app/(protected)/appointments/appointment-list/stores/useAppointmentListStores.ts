import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns } from "../components/data";

type AppointmentListStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
};

export const useAppointmentListStore = create<AppointmentListStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
    }),
    {
      name: "appointment-list-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
