import type { Metadata } from "next";
import { UsersPage } from "./components/users-page";

export const metadata: Metadata = {
  title: "E-Medical Record / Users",
  description: "E-Medical Record / Users",
};

export default function Page() {
  return <UsersPage />;
}
