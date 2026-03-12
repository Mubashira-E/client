"use client";

import { PageHeader } from "@/components/page-header";

export function AddMedicalDepartmentHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Create Medical Department"
          description="Add a new medical department to the system"
        />
      </div>
    </section>
  );
}
