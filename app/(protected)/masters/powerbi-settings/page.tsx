import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PowerBiSettingsForm } from "./components/powerbi-settings-form";

export const metadata: Metadata = {
  title: "E-Medical Record / PowerBI Settings",
  description: "E-Medical Record / PowerBI Settings",
};

export default function PowerBiSettingsPage() {
  return (
    <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
      <PageHeader
        title="Power BI Settings"
        description="Configure Power BI Dashboard URL"
      />
      <PowerBiSettingsForm />
    </section>
  );
}
