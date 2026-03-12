import { PageHeader } from "@/components/page-header";

export function AddLanguageHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <PageHeader
          title="Create Language"
          description="Create a new language"
        />
      </div>
    </section>
  );
}
