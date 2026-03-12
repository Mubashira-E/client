import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns } from "../components/data";

type ClinicianManagementStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

export const useClinicianManagementStore = create<ClinicianManagementStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
      selectAllColumns: () => set({ visibleColumns: allColumns.map(col => col.id) }),
      deselectAllColumns: () => set({ visibleColumns: [allColumns[0].id] }), // Keep at least one column visible
    }),
    {
      name: "clinician-management-store-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
