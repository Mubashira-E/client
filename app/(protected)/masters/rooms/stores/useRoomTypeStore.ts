import { create } from "zustand";

type RoomTypeState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = [
  "typeName",
  "description",
];

export const useRoomTypeStore = create<RoomTypeState>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: defaultColumns }),
  deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
}));
