import { create } from "zustand";

type PackageManagementState = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = [
  "packageName",
  "treatments",
  "duration",
  "pricing",
  "validity",
  "bookings",
  "status",
];

export const usePackageManagementStore = create<PackageManagementState>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: defaultColumns }),
  deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
}));
