import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Medical Record / Dashboard",
  description: "E-Medical Record / Dashboard",
};

export default function DashboardPage() {
  return (
    <iframe
      title="MF2618 25C2521102513V7AM"
      className="w-full h-[85vh]"
      src="https://app.powerbi.com/view?r=eyJrIjoiNzFmYjFkOGMtMzhmOC00MzBjLTgyNzEtYmU3YTc2ODNjOWE0IiwidCI6IjQ4MTY1NGJmLTcwYjUtNDhiZC1hYWNjLTM3YzhlNDhlY2QwYyJ9"
      frameBorder="0"
      allowFullScreen
    >
    </iframe>
  );
}
