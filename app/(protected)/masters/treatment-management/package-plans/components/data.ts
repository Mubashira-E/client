export type Column = {
  id: string;
  name: string;
};

export function getAllColumns(): Column[] {
  return [
    { id: "packageName", name: "Package Name" },
    { id: "packageCode", name: "Package Code" },
    { id: "treatments", name: "Treatments" },
    { id: "durationPerSession", name: "Duration Per Session" },
    { id: "totalDuration", name: "Total Duration" },
    { id: "pricing", name: "Pricing" },
  ];
}

export const packageCategories = [
  { id: 1, name: "Wellness Programs" },
  { id: 2, name: "Stress Relief" },
  { id: 3, name: "Detoxification" },
  { id: 4, name: "Weight Management" },
  { id: 5, name: "Rejuvenation" },
];
