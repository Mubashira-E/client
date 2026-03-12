import type { SubServiceClassificationResponse } from "@/types/sub-service-classification";

export const mockSubServiceClassifications: SubServiceClassificationResponse[] = [
  {
    subServiceClassificationId: 1,
    subServiceClassification: "General Consultation",
    serviceClassification: "Medical Services",
    serviceClassificationId: "1",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 2,
    subServiceClassification: "Specialist Consultation",
    serviceClassification: "Medical Services",
    serviceClassificationId: "1",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 3,
    subServiceClassification: "X-Ray",
    serviceClassification: "Diagnostic Services",
    serviceClassificationId: "2",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 4,
    subServiceClassification: "Blood Test",
    serviceClassification: "Laboratory Services",
    serviceClassificationId: "3",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 5,
    subServiceClassification: "Antibiotics",
    serviceClassification: "Pharmacy",
    serviceClassificationId: "4",
    isDrug: true,
    status: true,
    vatPercentage: 0,
  },
  {
    subServiceClassificationId: 6,
    subServiceClassification: "Pain Medication",
    serviceClassification: "Pharmacy",
    serviceClassificationId: "4",
    isDrug: true,
    status: true,
    vatPercentage: 0,
  },
  {
    subServiceClassificationId: 7,
    subServiceClassification: "MRI Scan",
    serviceClassification: "Diagnostic Services",
    serviceClassificationId: "2",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 8,
    subServiceClassification: "CT Scan",
    serviceClassification: "Diagnostic Services",
    serviceClassificationId: "2",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 9,
    subServiceClassification: "Physiotherapy",
    serviceClassification: "Therapeutic Services",
    serviceClassificationId: "5",
    isDrug: false,
    status: true,
    vatPercentage: 5,
  },
  {
    subServiceClassificationId: 10,
    subServiceClassification: "Vitamins & Supplements",
    serviceClassification: "Pharmacy",
    serviceClassificationId: "4",
    isDrug: false,
    status: false,
    vatPercentage: 5,
  },
];

// In-memory storage for mock data (simulates database)
let mockData = [...mockSubServiceClassifications];

export function getMockSubServiceClassifications() {
  return mockData;
}

export function addMockSubServiceClassification(item: SubServiceClassificationResponse) {
  mockData.push(item);
  return item;
}

export function updateMockSubServiceClassification(id: number, updates: Partial<SubServiceClassificationResponse>) {
  const index = mockData.findIndex(item => item.subServiceClassificationId === id);
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...updates };
    return mockData[index];
  }
  return null;
}

export function deleteMockSubServiceClassification(id: number) {
  const index = mockData.findIndex(item => item.subServiceClassificationId === id);
  if (index !== -1) {
    const deleted = mockData[index];
    mockData.splice(index, 1);
    return deleted;
  }
  return null;
}

export function toggleMockSubServiceClassificationStatus(id: number) {
  const index = mockData.findIndex(item => item.subServiceClassificationId === id);
  if (index !== -1) {
    mockData[index].status = !mockData[index].status;
    return mockData[index];
  }
  return null;
}

export function resetMockData() {
  mockData = [...mockSubServiceClassifications];
}
