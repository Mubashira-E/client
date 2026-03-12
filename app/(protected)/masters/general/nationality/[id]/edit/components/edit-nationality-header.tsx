import { PageHeader } from "@/components/page-header";

export function EditNationalityHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Update Nationality"
          description="Update the nationality details"
        />
      </div>
    </section>
  );
}
