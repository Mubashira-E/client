import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type InventoryManagementState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = [
  "itemName",
  "category",
  "unit",
  "remarks",
  "status",
];

export const useInventoryManagementStore = create<InventoryManagementState>()(
  persist(
    set => ({
      visibleColumns: defaultColumns,
      setVisibleColumns: columns => set({ visibleColumns: columns }),
      selectAllColumns: () => set({ visibleColumns: defaultColumns }),
      deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
    }),
    {
      name: "inventory-management-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
