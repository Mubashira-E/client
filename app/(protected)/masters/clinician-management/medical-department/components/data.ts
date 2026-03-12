export const allColumns = [
  { id: "medicalDepartmentName", name: "Medical Department", sortable: true },
  { id: "status", name: "Status", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}
