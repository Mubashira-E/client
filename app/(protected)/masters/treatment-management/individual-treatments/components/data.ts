export type Column = {
  id: string;
  name: string;
};

export function getAllColumns(): Column[] {
  return [
    { id: "treatmentName", name: "Treatment Name" },
    { id: "category", name: "Category" },
    { id: "duration", name: "Duration" },
    { id: "price", name: "Price" },
    { id: "status", name: "Status" },
  ];
}

export type Treatment = {
  id: number;
  treatmentName: string;
  category: string;
  duration: string;
  price: string;
  status: "Active" | "Inactive";
  description: string;
  createdDate: string;
};

export const mockTreatments: Treatment[] = [
  {
    id: 1,
    treatmentName: "Panchakarma Therapy",
    category: "Detoxification",
    duration: "90 minutes",
    price: "150",
    status: "Active",
    description: "Complete detoxification and rejuvenation therapy",
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    treatmentName: "Abhyanga Massage",
    category: "Massage Therapy",
    duration: "60 minutes",
    price: "80",
    status: "Active",
    description: "Full body oil massage for relaxation and healing",
    createdDate: "2024-01-10",
  },
  {
    id: 3,
    treatmentName: "Shirodhara",
    category: "Rejuvenation",
    duration: "45 minutes",
    price: "120",
    status: "Active",
    description: "Continuous pouring of oil on forehead for mental peace",
    createdDate: "2024-01-08",
  },
  {
    id: 4,
    treatmentName: "Herbal Steam Bath",
    category: "Herbal Treatment",
    duration: "30 minutes",
    price: "50",
    status: "Inactive",
    description: "Steam therapy with medicinal herbs",
    createdDate: "2024-01-05",
  },
  {
    id: 5,
    treatmentName: "Nasya Treatment",
    category: "Panchakarma",
    duration: "20 minutes",
    price: "70",
    status: "Active",
    description: "Nasal administration of medicated oils",
    createdDate: "2024-01-03",
  },
];
