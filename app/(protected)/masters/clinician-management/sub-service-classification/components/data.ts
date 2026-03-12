export const allColumns = [
  { id: "subServiceClassificationId", name: "Sub Service Classification ID", sortable: true },
  { id: "subServiceClassification", name: "Sub Service Classification", sortable: true },
  { id: "serviceClassification", name: "Service Classification", sortable: true },
  { id: "isDrug", name: "Is Drug", sortable: true },
  { id: "vatPercentage", name: "VAT Percentage", sortable: true },
  { id: "status", name: "Status", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}
