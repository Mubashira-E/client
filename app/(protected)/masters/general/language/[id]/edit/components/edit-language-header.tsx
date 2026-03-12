import { PageHeader } from "@/components/page-header";

export function EditLanguageHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Update Language"
          description="Update the language details"
        />
      </div>
    </section>
  );
}
