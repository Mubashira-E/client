import { create } from "zustand";

type VisitManagementStore = {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
};

const defaultColumns = ["emrNo", "patientName", "visitId", "visitDate", "department", "doctor", "diagnosisType", "treatmentCode", "treatmentName"];

export const useVisitManagementStore = create<VisitManagementStore>(set => ({
  visibleColumns: defaultColumns,
  setVisibleColumns: columns => set({ visibleColumns: columns }),
  selectAllColumns: () => set({ visibleColumns: defaultColumns }),
  deselectAllColumns: () => set({ visibleColumns: [defaultColumns[0]] }), // Keep at least one column
}));
