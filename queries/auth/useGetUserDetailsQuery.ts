import { useQuery } from "@tanstack/react-query";
import { authEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

type Action = "Create" | "Delete" | "Read" | "Update";

type Resource =
  | "AppointmentCancelledReason"
  | "AppointmentMode"
  | "AppointmentReason"
  | "Appointments"
  | "AppointmentStatus"
  | "AppointmentType"
  | "BookAppointment"
  | "Clinician"
  | "ClinicianLeave"
  | "ClinicianSchedule"
  | "Dashboard"
  | "DataImport"
  | "Department"
  | "IndividualTreatment"
  | "InventoryCategory"
  | "InventoryItem"
  | "Nationality"
  | "PackagePlan"
  | "Patient"
  | "Roles"
  | "Room"
  | "RoomType"
  | "Rota"
  | "Users"
  | "Visit"
  | "WellnessProgram";

export type UserPermission = `${Resource}.${Action}`;

export type UserDetails = {
  id: string;
  email: string;
  roles: string[];
  lastName: string;
  firstName: string;
  permissions: UserPermission[];
};

export function useGetUserDetailsQuery() {
  const { jwtToken } = useAuthStore();

  return useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      const response = await api.get(authEndpoints.userDetails);
      return response.data as UserDetails;
    },
    enabled: !!jwtToken,
  });
}
