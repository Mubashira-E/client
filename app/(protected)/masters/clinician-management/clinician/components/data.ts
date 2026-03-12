export const allColumns = [
  { id: "clinicianCode", name: "Code", sortable: true },
  { id: "clinicianName", name: "Clinician", sortable: true },
  { id: "profession", name: "Profession", sortable: true },
  { id: "medicalDepartmentName", name: "Medical Department", sortable: true },
  { id: "major", name: "Major", sortable: true },
  { id: "status", name: "Status", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}

// For backwards compatibility - returns the allColumns array
export function getAllColumns() {
  return allColumns;
}
