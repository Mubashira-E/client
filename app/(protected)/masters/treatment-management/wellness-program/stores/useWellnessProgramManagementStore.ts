import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getAllColumns } from "../components/data";

type WellnessProgramManagementState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

function getAllColumnIds(): string[] {
  return getAllColumns().map(col => col.id);
}

export const useWellnessProgramManagementStore = create<WellnessProgramManagementState>()(
  persist(
    set => ({
      visibleColumns: getAllColumnIds(),
      setVisibleColumns: columns => set({ visibleColumns: columns }),
      selectAllColumns: () => set({ visibleColumns: getAllColumnIds() }),
      deselectAllColumns: () => set({ visibleColumns: [] }),
    }),
    {
      name: "wellness-program-store",
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
