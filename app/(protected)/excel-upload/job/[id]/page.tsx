import type { Metadata } from "next";
import { JobDetailsPage } from "../../components/job-details-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Job Details",
  description: "E-Medical Record / Job Details",
};

type JobDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailsRoute({ params }: JobDetailsRouteProps) {
  const { id } = await params;

  return (
    <section className="flex flex-col gap-4">
      <JobDetailsPage jobId={id} />
    </section>
  );
}
