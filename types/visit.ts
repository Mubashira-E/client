export type Visit = {
  visitId: string;
  emrNo: string;
  patientName: string;
  visitDate: string;
  visitType: string;
  department: string;
  doctor: string;
  diagnosisType?: string;
  treatmentCode?: string;
  treatmentName?: string;
};

export type VisitManagementResponse = {
  visitId: string;
  emrNo: string;
  patientName: string;
  visitDate: string;
  visitType: string;
  department: string;
  doctor: string;
  diagnosisType?: string;
  treatmentCode?: string;
  treatmentName?: string;
  createdDate?: string;
  updatedDate?: string;
};

export type VisitWidget = {
  totalVisitCount: number;
  recentVisitDetail: VisitManagementResponse | null;
};

export type VisitDiagnosis = {
  icdCode: string;
  description: string;
  diagnosisType: string;
};

export type VisitProcedure = {
  cptCode: string;
  description: string;
  procedureType: string;
};

export type VisitTreatment = {
  treatmentCode: string;
  treatmentName: string;
  description: string;
};

export type VisitBill = {
  billNo: number;
  billType: string;
  grossAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  vatAmount: number;
};

export type VisitDetails = {
  visitId: string;
  visitNo: number;
  emrNumber: string;
  patientName: string;
  visitDate: string;
  medicalDepartmentName: string;
  clinicianName: string;
  clinicianId: string;       
  treatmentId: string;       
  roomId: string;             
  visitType: string;
  status: string;            // "Scheduled" | "Arrived" | "Completed" | "Cancelled"
  startTime?: string;        
  mobileNumber?: string;
  diagnosis: VisitDiagnosis[];
  procedures: VisitProcedure[];
  treatments: VisitTreatment[];
  bills: VisitBill[];
};