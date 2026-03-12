import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns, getAllColumnIds } from "../components/data";

type SubServiceClassificationStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

export const useSubServiceClassificationStore = create<SubServiceClassificationStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
      selectAllColumns: () => set({ visibleColumns: getAllColumnIds() }),
      deselectAllColumns: () => set({ visibleColumns: [] }),
    }),
    {
      name: "sub-service-classification-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
