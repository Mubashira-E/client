import type { Metadata } from "next";
import AyurvedicDashboard from "./components/ayurvedic-dashboard";

export const metadata: Metadata = {
  title: "E-Medical Record/ Dashboard",
  description: "E-Medical Record/ Dashboard",
};

export default function Home() {
  return (
    <div className="p-6">
      <AyurvedicDashboard />
    </div>
  );
}
