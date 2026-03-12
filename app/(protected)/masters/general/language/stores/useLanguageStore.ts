import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns, getAllColumnIds } from "../components/data";

type LanguageStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
      selectAllColumns: () => set({ visibleColumns: getAllColumnIds() }),
      deselectAllColumns: () => set({ visibleColumns: [] }),
    }),
    {
      name: "language-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
