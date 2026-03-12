"use client";

import type { ClinicianResponse } from "@/queries/clinician/useGetAllClinicianQuery";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ClinicianManagementCardProps = {
  name: string;
  clinicianLicense: string;
  clinicianDepartment: string;
  clinician: ClinicianResponse;
  clinicianId: number;
};

export function ClinicianManagementCard({ name, clinicianLicense, clinicianDepartment, clinician }: ClinicianManagementCardProps) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/masters/clinician-management/clinician/${clinician.clinicianId}/edit`);
  };

  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3 pt-3 hover:border-primary">
      <section className="flex w-full flex-col gap-2">
        <div className="flex size-10 items-center justify-center rounded-full border border-primary text-primary">
          <Avatar className="size-10">
            <AvatarFallback className="border-none bg-primary text-lg font-semibold text-white">
              {name?.charAt(0)?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="mt-2 flex w-full justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg text-primary line-clamp-1">{name}</h2>
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 text-sm">
                  <span className="font-medium">License:</span>
                  {" "}
                  {clinicianLicense}
                </span>
                <span className="text-gray-600 text-sm">
                  <span className="font-medium">Department:</span>
                  {" "}
                  {clinicianDepartment}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="flex w-full items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className="p-0 text-sm"
              onClick={handleEditClick}
            >
              <div className="flex items-center justify-center gap-1 text-blue-700">
                <Edit className="size-4" />
                Edit
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
