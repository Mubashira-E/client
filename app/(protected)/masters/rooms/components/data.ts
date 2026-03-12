export const allColumns = [
  { id: "roomName", name: "Room Name", sortable: true },
  { id: "roomType", name: "Room Type", sortable: true },
  { id: "roomLocation", name: "Room Location", sortable: true },
  { id: "remarks", name: "Remarks", sortable: true },
  { id: "status", name: "Status", sortable: true },
];

export function getAllColumnIds(): string[] {
  return allColumns.map(col => col.id);
}

export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}
