import type { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Room Type",
  description: "E-Medical Record / Edit Room Type",
};

export default function Page(props: any) {
  return <ClientPage {...props} />;
}
