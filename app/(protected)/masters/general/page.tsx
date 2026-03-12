import type { Metadata } from "next";
import { Suspense } from "react";
import { GeneralTabs } from "./components/general-tabs";

export const metadata: Metadata = {
  title: "E-Medical Record / General",
  description: "E-Medical Record / General",
};

export default function GeneralMastersPage() {
  return (
    <Suspense>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-gray-800">General</h1>
          <p className="text-sm text-gray-600 -mt-1">General</p>
        </div>
        <GeneralTabs />
      </div>
    </Suspense>
  );
}
