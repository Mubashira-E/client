import { create } from "zustand";

type TreatmentManagementState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = [
  "treatmentName",
  "category",
  "duration",
  "price",
  "status",
];

export const useTreatmentManagementStore = create<TreatmentManagementState>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: defaultColumns }),
  deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
}));
