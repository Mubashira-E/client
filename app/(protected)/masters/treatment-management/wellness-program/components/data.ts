export type Column = {
  id: string;
  name: string;
};

export function getAllColumns(): Column[] {
  return [
    { id: "programCode", name: "Program Code" },
    { id: "programName", name: "Program Name" },
    { id: "description", name: "Description" },
    { id: "packages", name: "Packages" },
    { id: "treatments", name: "Treatments" },
    { id: "totalDuration", name: "Duration" },
    { id: "price", name: "Price" },
    { id: "status", name: "Status" },
  ];
}

export type WellnessProgram = {
  id: string;
  programCode: string;
  programName: string;
  description?: string;
  selectedPackages: string[]; // Array of package IDs
  selectedTreatments: string[]; // Array of treatment IDs
  durationPerSession?: number; // Duration per session in minutes
  totalDuration?: number; // Total duration value
  totalDurationUnit?: number; // Duration unit ID (hours/days/weeks/months/years)
  price: number; // Price in AED (manually entered)
  notes?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};

// Mock packages data (in real app, this would come from the package management system)
export const availablePackages = [
  {
    id: "1",
    name: "Complete Wellness Package",
    description: "Comprehensive 7-day wellness program",
    price: 12720,
    status: "active",
  },
  {
    id: "2",
    name: "Stress Relief Combo",
    description: "Perfect combination for stress relief",
    price: 6000,
    status: "active",
  },
  {
    id: "3",
    name: "Detox & Rejuvenation",
    description: "Intensive detox program",
    price: 15470,
    status: "active",
  },
];

// Mock treatments data (in real app, this would come from the treatment management system)
export const availableTreatments = [
  {
    id: "1",
    name: "Panchakarma Detox",
    description: "Complete detoxification therapy",
    price: 2500,
    status: "active",
  },
  {
    id: "2",
    name: "Abhyanga Massage",
    description: "Full body massage with herbal oils",
    price: 800,
    status: "active",
  },
  {
    id: "3",
    name: "Shirodhara",
    description: "Continuous pouring of medicated oil",
    price: 1200,
    status: "active",
  },
  {
    id: "4",
    name: "Nasya Therapy",
    description: "Nasal administration of medicated oils",
    price: 600,
    status: "active",
  },
  {
    id: "5",
    name: "Karna Purana",
    description: "Ear treatment with medicated oils",
    price: 500,
    status: "active",
  },
  {
    id: "6",
    name: "Udvartana",
    description: "Herbal powder massage for weight management",
    price: 900,
    status: "active",
  },
];

export const mockWellnessPrograms: WellnessProgram[] = [
  {
    id: "1",
    programCode: "WP-001",
    programName: "Complete Wellness Journey",
    description: "A comprehensive wellness program combining detox, relaxation, and rejuvenation therapies for complete mind-body wellness",
    selectedPackages: ["1", "2"],
    selectedTreatments: ["1", "2", "3"],
    durationPerSession: 90,
    totalDuration: 2,
    totalDurationUnit: 3, // weeks
    price: 25000,
    notes: "Recommended for complete wellness transformation",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    programCode: "WP-002",
    programName: "Stress Relief & Mental Wellness",
    description: "Specialized program focusing on stress reduction, mental clarity, and emotional balance through targeted therapies",
    selectedPackages: ["2"],
    selectedTreatments: ["2", "3", "4"],
    durationPerSession: 60,
    totalDuration: 10,
    totalDurationUnit: 2, // days
    price: 15000,
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    programCode: "WP-003",
    programName: "Detox & Weight Management",
    description: "Intensive detoxification program combined with weight management therapies for optimal health transformation",
    selectedPackages: ["3"],
    selectedTreatments: ["1", "6", "4", "5"],
    durationPerSession: 120,
    totalDuration: 3,
    totalDurationUnit: 3, // weeks
    price: 35000,
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    programCode: "WP-004",
    programName: "Quick Recovery Express",
    description: "Short-term recovery program designed for busy professionals seeking quick wellness benefits",
    selectedPackages: [],
    selectedTreatments: ["2", "5"],
    durationPerSession: 45,
    totalDuration: 5,
    totalDurationUnit: 2, // days
    price: 8000,
    status: "inactive",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];

// Static program categories for filtering
export const programCategories = [
  { id: 1, name: "Complete Wellness" },
  { id: 2, name: "Stress Relief" },
  { id: 3, name: "Detoxification" },
  { id: 4, name: "Weight Management" },
  { id: 5, name: "Quick Recovery" },
];
