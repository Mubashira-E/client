import { PageHeader } from "@/components/page-header";

export function EditClinicianLicenseHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Update Clinician"
          description="Update an existing clinician"
        />
      </div>
    </section>
  );
}
