import type { Metadata } from "next";
import { Suspense } from "react";
import { WellnessProgramManagementContainer } from "./components/wellness-program-management-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Wellness Program",
  description: "E-Medical Record / Wellness Program",
};

export default function WellnessProgramPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellnessProgramManagementContainer />
    </Suspense>
  );
}
