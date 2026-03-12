import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns, getAllColumnIds } from "../components/data";

type MedicalDepartmentStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

export const useMedicalDepartmentStore = create<MedicalDepartmentStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
      selectAllColumns: () => set({ visibleColumns: getAllColumnIds() }),
      deselectAllColumns: () => set({ visibleColumns: [] }),
    }),
    {
      name: "medical-department-store-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
