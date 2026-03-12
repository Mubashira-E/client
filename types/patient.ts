export type Patient = {
  emrNo: string;
  patientName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  mobileNo: string;
  nationality: string;
  patientId: number;
};

export type PatientManagementResponse = {
  emrNo: string;
  patientName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  mobileNo: string;
  emiratesId?: string;
  nationality: string;
  patientId: number;
  createdDate?: string;
  updatedDate?: string;
};

export type PatientWidget = {
  totalPatientCount: number;
  recentPatientDetail: PatientManagementResponse | null;
};

export type Diagnosis = {
  icdCode: string;
  description: string;
  diagnosisType: string;
};

export type Procedure = {
  cptCode: string;
  description: string;
  procedureType: string;
};

export type Treatment = {
  treatmentCode: string;
  treatmentName: string;
  description: string;
};

export type VisitSummary = {
  visitId: string;
  visitNo: number;
  visitDate: string;
  medicalDepartmentName: string;
  clinicianName: string;
  visitType: string;
};

export type LatestVisit = {
  visitId: string;
  visitNo: number;
  visitDate: string;
  medicalDepartmentName: string;
  clinicianName: string;
  visitType: string;
  diagnosis: Diagnosis[];
  procedures: Procedure[];
  treatments: Treatment[];
};

export type PatientDetails = {
  patientId: string;
  emrNumber: string;
  patientName: string;
  age: number;
  nationalityId: string;
  nationalityName: string;
  emiratesId: string;
  latestVisit: LatestVisit;
  visit: VisitSummary[];
};
