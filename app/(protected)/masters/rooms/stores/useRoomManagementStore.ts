import { create } from "zustand";
import { getAllColumnIds } from "../components/data";

type RoomManagementState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const allColumnIds = getAllColumnIds();
// Hide "remarks" column by default
const defaultColumns = allColumnIds.filter(id => id !== "remarks");

export const useRoomManagementStore = create<RoomManagementState>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: allColumnIds }),
  deselectAllColumns: () => set({ visibleColumns: [allColumnIds[0]] }), // Keep at least one column
}));
