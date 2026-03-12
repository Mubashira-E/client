export type SubServiceClassificationResponse = {
  subServiceClassificationId: number;
  subServiceClassification: string;
  serviceClassification: string;
  serviceClassificationId: string;
  isDrug: boolean;
  status: boolean;
  vatPercentage: number;
};

export type SubServiceClassificationRequest = {
  subServiceClassification: string;
  serviceClassificationId: number;
  isDrug: boolean;
  vatPercentage: number;
};

export type SubServiceClassificationApiResponse = {
  data: SubServiceClassificationResponse[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortDirection: string;
};
