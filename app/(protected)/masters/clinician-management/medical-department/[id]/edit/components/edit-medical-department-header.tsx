"use client";

import { PageHeader } from "@/components/page-header";

export function EditMedicalDepartmentHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Update Medical Department"
          description="Update an existing medical department"
        />
      </div>
    </section>
  );
}
