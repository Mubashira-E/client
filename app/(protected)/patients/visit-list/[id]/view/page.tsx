import type { Metadata } from "next";
import { VisitDetailsPage } from "./components/visit-details-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Visit Details",
  description: "E-Medical Record / Visit Details",
};

type VisitDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VisitDetailsRoute({ params }: VisitDetailsRouteProps) {
  const { id } = await params;
  return (
    <section className="flex flex-col gap-4">
      <VisitDetailsPage visitId={id} />
    </section>
  );
}
