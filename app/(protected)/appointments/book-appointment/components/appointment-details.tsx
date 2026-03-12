"use client";

"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { Box, Building2, DraftingCompass, FlaskConical } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGetAllMedicalDepartmentQuery } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";
import { useGetAllTreatmentQuery } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
import { useGetAllRoomsQuery } from "@/queries/visit/useGetAllRoomsQuery";

export function AppointmentDetails() {
  const { control, trigger } = useFormContext<CreateAppointmentSchema>();

  const { data: roomsData, isLoading: loadingRooms } = useGetAllRoomsQuery();
  const { treatments, isLoading: loadingTreatments } = useGetAllTreatmentQuery({
    PageSize: 100,
    PageNumber: 1,
  });
  const { medicalDepartments, isLoading: loadingDepartments }
    = useGetAllMedicalDepartmentQuery({ pageSize: 100, pageNumber: 1 });

  // Stable reference — prevents useEffect dep-change warnings in consumers
  const rooms = useMemo(() => roomsData?.items ?? [], [roomsData]);

  return (
    <section className="flex flex-col gap-4">
      <FormLabel className="mt-2 col-span-3">
        <Building2 className="size-4 text-primary" />
        Appointment Details
      </FormLabel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Department */}
        <FormField
          control={control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <DraftingCompass className="size-4 text-primary" />
                Department
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  disabled={loadingDepartments}
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    trigger("departmentId");
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue
                      placeholder={
                        loadingDepartments ? "Loading..." : "Select Department"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-50 overflow-y-auto">
                    {medicalDepartments.map(dept => (
                      <SelectItem
                        key={dept.medicalDepartmentId}
                        value={dept.medicalDepartmentId}
                      >
                        {dept.medicalDepartmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Treatment — required by backend slot validator */}
        <FormField
          control={control}
          name="treatmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FlaskConical className="size-4 text-primary" />
                Treatment
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  disabled={loadingTreatments}
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    trigger("treatmentId");
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue
                      placeholder={
                        loadingTreatments ? "Loading..." : "Select Treatment"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-50 overflow-y-auto">
                    {treatments.map(t => (
                      <SelectItem key={t.treatmentId} value={t.treatmentId}>
                        {t.treatmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room */}
        <FormField
          control={control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Box className="size-4 text-primary" />
                Room
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  disabled={loadingRooms}
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    trigger("roomId");
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue
                      placeholder={loadingRooms ? "Loading..." : "Select Room"}
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-50 overflow-y-auto">
                    {rooms.map((room: any) => (
                      <SelectItem
                        key={room.roomId}
                        value={room.roomId.toString()}
                      >
                        {room.roomName}
                        {room.roomLocation ? ` — ${room.roomLocation}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
