export const allColumns = [
  { id: "languageName", name: "Language Name", sortable: true },
  { id: "languageCode", name: "Language Code", sortable: true },
  { id: "isActive", name: "Status", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}
