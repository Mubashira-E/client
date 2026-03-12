import { create } from "zustand";

type PatientManagementStore = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = ["emrNo", "patientName", "age", "emiratesId", "nationality"];
const allColumns = ["emrNo", "patientName", "age", "emiratesId", "nationality"];

export const usePatientManagementStore = create<PatientManagementStore>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: allColumns }),
  deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
}));
