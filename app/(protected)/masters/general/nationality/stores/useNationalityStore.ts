import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allColumns, getAllColumnIds } from "../components/data";

type NationalityStore = {
  visibleColumns: string[];
  setVisibleColumns: (visibleColumns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

export const useNationalityStore = create<NationalityStore>()(
  persist(
    set => ({
      visibleColumns: allColumns.map(col => col.id),
      setVisibleColumns: visibleColumns => set({ visibleColumns }),
      selectAllColumns: () => set({ visibleColumns: getAllColumnIds() }),
      deselectAllColumns: () => set({ visibleColumns: [] }),
    }),
    {
      name: "nationality-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, _version: number) => {
        // Reset to default columns if migrating or if persisted columns don't match current columns
        const validColumnIds = getAllColumnIds();
        const hasInvalidColumns = !persistedState?.visibleColumns
          || !Array.isArray(persistedState.visibleColumns)
          || persistedState.visibleColumns.some((id: string) => !validColumnIds.includes(id));

        if (hasInvalidColumns) {
          return {
            ...persistedState,
            visibleColumns: validColumnIds,
          };
        }

        return persistedState;
      },
    },
  ),
);
