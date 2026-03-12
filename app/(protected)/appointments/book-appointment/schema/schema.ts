import { z } from "zod";

// ─── Slot ─────────────────────────────────────────────────────────────────────
export const SlotsSchema = z.object({
  slotId: z.number().min(1, "Please select an appointment slot"),
  slotTime: z.string().trim().min(1, "Slot time is required"),
  bookedStatus: z.string().trim(),
  // Preserved from backend response for accurate time submission
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// ─── BookedInfo ───────────────────────────────────────────────────────────────
export const BookedInfoSchema = z.object({
  slotDate: z.string().trim().min(1, "Slot date is required"), // "dd/MM/yyyy"
  rotaName: z.string().trim(),
  slots: z.array(SlotsSchema),
});

// ─── PatientInfo ──────────────────────────────────────────────────────────────
// All fields are optional at the schema level; validation enforced in UI per mode.
export const PatientInfoSchema = z.object({
  patientId: z.string().optional(),
  patientTitle: z.number().optional(),
  patientTitleId: z.number().int().nonnegative().optional(),
  patientsTitle: z.string().trim().optional(),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[A-Z\s]+$/i, "First name must contain only letters and spaces")
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  mrn: z.string().trim().optional(),
  genderId: z.number().int().nonnegative().optional(),
  maritalStatusId: z.number().optional(),
  maritalStatus: z.string().trim().optional(),
  emiratesId: z
    .string()
    .trim()
    .regex(/^\d{3}-\d{4}-\d{7}-\d$/, "Emirates ID must be in format: XXX-XXXX-XXXXXXX-X")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().trim().optional(),
  mobileNo: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  patientAddress: z.string().trim().optional(),
  countryId: z.number().optional(),
  countryName: z.string().trim().optional(),
});

// ─── Root ─────────────────────────────────────────────────────────────────────
export const AppointmentSchema = z.object({
  patientId: z.string(),
  clinicianId: z.string().min(1, "Clinician is required"),
  roomId: z.string().min(1, "Room is required"),
  treatmentId: z.string().optional(),
  departmentId: z.string().optional(),
  bookedInfo: BookedInfoSchema,
  patientInfo: PatientInfoSchema.optional(),
  remarks: z.string().trim().optional(),
  facilityId: z.number().optional(),
  regulatoryId: z.number().optional(),
  locationId: z.number().optional(),
});

export type CreateAppointmentSchema = z.infer<typeof AppointmentSchema>;

// ─── What we POST to /api/v1/visit ───────────────────────────────────────────
// Backend: PostVisitRequest { PatientId, ClinicianId, RoomId, VisitDate, StartTime, EndTime }
export type CreateVisitRequest = {
  patientId: string; // Guid string
  clinicianId: string; // Guid string
  roomId: string; // Guid string
  visitDate: string; // ISO "yyyy-MM-dd"  — .NET parses as DateTime
  startTime: string; // "HH:mm:ss"        — .NET parses as TimeSpan
  endTime: string; // "HH:mm:ss"        — .NET parses as TimeSpan
};
