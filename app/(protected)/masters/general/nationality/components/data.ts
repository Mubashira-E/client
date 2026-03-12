export const allColumns = [
  { id: "nationalityName", name: "Nationality", sortable: true },
  { id: "nationalityCode", name: "Nationality Code", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}
