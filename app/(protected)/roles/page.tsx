import type { Metadata } from "next";
import { RolesPage } from "./components/roles-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Roles",
  description: "E-Medical Record / Roles",
};

export default function Roles() {
  return <RolesPage />;
}
