import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { UserForm } from "../components/user-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create User",
  description: "E-Medical Record / Create User",
};

export default function CreateUserPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link href="/users" className="flex items-center gap-0.5 text-primary">
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Users</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Add User"
          description="Create a new user account and assign their initial roles"
        />
        <UserForm isEdit={false} />
      </section>
    </section>
  );
}
