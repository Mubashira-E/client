import type { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Role",
  description: "E-Medical Record / Edit Role",
};

export default function Page(props: any) {
  return <ClientPage {...props} />;
}
