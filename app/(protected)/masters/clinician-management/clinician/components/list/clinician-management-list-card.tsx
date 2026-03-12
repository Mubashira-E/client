"use client";

import type { ClinicianResponse } from "@/queries/clinician/useGetAllClinicianQuery";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ClinicianManagementListCardProps = {
  name: string;
  clinicianLicense: string;
  clinicianDepartment: string;
  clinician: ClinicianResponse;
  clinicianId: number;
};

export function ClinicianManagementListCard({ name, clinicianLicense, clinicianDepartment, clinician }: ClinicianManagementListCardProps) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/masters/clinician-management/clinician/${clinician.clinicianId}/edit`);
  };

  return (
    <div className="grid grid-cols-3 justify-between rounded-md border border-gray-300 bg-white p-4 hover:border-primary">
      <div className="flex min-w-[200px] items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full border border-primary text-primary">
          <Avatar className="size-10">
            <AvatarFallback className="border-none bg-primary text-lg font-semibold text-white">
              {name?.charAt(0)?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="truncate text-base font-medium text-primary">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{clinicianDepartment}</span>
          </div>
        </div>
      </div>
      <div className="mx-4 flex  items-center">
        <span className="text-sm text-gray-600">
          License:
          {" "}
          {clinicianLicense}
        </span>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2">
        <Button
          variant="link"
          className="px-0 py-0 text-sm"
          onClick={handleEditClick}
        >
          <div className="flex items-center justify-center gap-1 text-blue-700">
            <Edit className="size-4" />
            Edit
          </div>
        </Button>
      </div>
    </div>
  );
}
