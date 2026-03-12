import type { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Room Type",
  description: "E-Medical Record / Create Room Type",
};

export default function Page(props: any) {
  return <ClientPage {...props} />;
}
