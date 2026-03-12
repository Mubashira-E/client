export function getColumns() {
  return [
    { id: "patientName", name: "Patient Name", sortable: true },
    { id: "bookingNumber", name: "Appointment Code", sortable: true },
    { id: "medicalDepartment", name: "Department", sortable: true },
    { id: "clinician", name: "Clinician", sortable: true },
    { id: "clinicianSlotTime", name: "Slot Time", sortable: true },
    { id: "clinicianSlotDate", name: "Date", sortable: true },
    { id: "mobile", name: "Mobile", sortable: true },
    { id: "appointmentStatus", name: "Status", sortable: true },
  ];
}

// Helper function to get all column IDs
export function getAllColumnIds(): string[] {
  return [
    "patientName",
    "bookingNumber",
    "medicalDepartment",
    "clinician",
    "clinicianSlotTime",
    "clinicianSlotDate",
    "mobile",
    "appointmentStatus",
  ];
}

// Helper function to check if all columns are selected
export function areAllColumnsSelected(visibleColumns: string[]): boolean {
  const allIds = getAllColumnIds();
  return allIds.every(id => visibleColumns.includes(id));
}

// Keep the original export for backward compatibility during transition
export const allColumns = [
  { id: "patientName", name: "Patient Name", sortable: true },
  { id: "bookingNumber", name: "Appointment Code", sortable: true },
  { id: "medicalDepartment", name: "Department", sortable: true },
  { id: "clinician", name: "Clinician", sortable: true },
  { id: "clinicianSlotTime", name: "Slot Time", sortable: true },
  { id: "clinicianSlotDate", name: "Date", sortable: true },
  { id: "mobile", name: "Mobile", sortable: true },
  { id: "appointmentStatus", name: "Status", sortable: true },
];
