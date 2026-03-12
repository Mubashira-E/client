
export enum VisitStatus {
  Scheduled  = 1,
  Arrived    = 2,
  InProgress = 3,
  Completed  = 4,
  Cancelled  = 5,
}

export interface PostVisitRequest {
  patientId:   string;   
  clinicianId: string;  
  roomId:      string;   
  visitDate:   string;   
  startTime:   string;   
  endTime:     string;   
}

export interface VisitRescheduleRequest {
  visitId:        string;  
  newVisitDate:   string;  
  newClinicianId: string;  
}

export interface VisitStatusChangeRequest {
  visitId:   string;  
  newStatus: VisitStatus; 
}

export interface AvailableSlotsRequest {
  clinicianId:  string;  
  date:         string;  
  treatmentId:  string;  
  roomId:       string;  
}

export interface PostVisitResponse {
  visitId:   string;
  isSuccess: boolean;  
  message:   string;
}

export interface VisitGetAllResponse {
  visitId:               string;
  visitNo:               number;
  patientId:             string;
  patientName:           string;
  emrNumber:             string;
  visitDate:             string;
  medicalDepartmentId:   string;
  medicalDepartmentName: string;
  clinicianId:           string;
  clinicianName:         string;
  visitType:             string;
}

export interface VisitGetByIdResponse extends VisitGetAllResponse {
  notes?:   string;
  billType: string;
  status:   string;
}

export interface AvailableSlotsResponse {
  timeSlot:    string;   
  startTime:   string;   
  endTime:     string;   
  isAvailable: boolean;
}

export interface GetDailyQueueResponse {
  visitId:       string;
  visitNo:       number;
  patientName:   string;
  timeSlot:      string;
  treatmentName: string;
  status:        string;
  clinicianName: string;
}

export interface VisitRescheduleResponse {
  visitId:      string;
  newStartTime: string;
  newEndTime:   string;
  status:       string;  // "Rescheduled"
}

export interface VisitStatusChangeResponse {
  visitId:       string;
  newStatusName: string;
  updatedAt:     string;
}
export interface RoomGetAllResponse {
  roomId:       string;
  roomName:     string;
  roomTypeId:   string;
  roomType:     string;
  roomLocation: string;
  remarks?:     string;
  status?:      string;
}