import type { Metadata } from "next";
import { ExcelUploadContainer } from "./components/excel-upload-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Excel Upload",
  description: "E-Medical Record / Excel Upload",
};

export default function ExcelUploadPage() {
  return (
    <section className="flex flex-col gap-4">
      <ExcelUploadContainer />
    </section>
  );
}
