export type Column = {
  id: string;
  name: string;
};

export function getAllColumns(): Column[] {
  return [
    { id: "itemName", name: "Item Name" },
    { id: "category", name: "Category" },
    { id: "unit", name: "Unit" },
    { id: "remarks", name: "Remarks" },
    { id: "status", name: "Status" },
  ];
}
