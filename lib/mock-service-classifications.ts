export type ServiceClassificationResponse = {
  serviceClassificationId: number;
  serviceClassification: string;
  status: boolean;
};

export const mockServiceClassifications: ServiceClassificationResponse[] = [
  {
    serviceClassificationId: 1,
    serviceClassification: "Medical Services",
    status: true,
  },
  {
    serviceClassificationId: 2,
    serviceClassification: "Diagnostic Services",
    status: true,
  },
  {
    serviceClassificationId: 3,
    serviceClassification: "Laboratory Services",
    status: true,
  },
  {
    serviceClassificationId: 4,
    serviceClassification: "Pharmacy",
    status: true,
  },
  {
    serviceClassificationId: 5,
    serviceClassification: "Therapeutic Services",
    status: true,
  },
];

export function getMockServiceClassifications() {
  return mockServiceClassifications;
}
