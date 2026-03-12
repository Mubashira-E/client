import type { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit User",
  description: "E-Medical Record / Edit User",
};

export default function Page(props: any) {
  return <ClientPage {...props} />;
}
