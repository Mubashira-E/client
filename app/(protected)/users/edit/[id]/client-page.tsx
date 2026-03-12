"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";

import { useGetUserByIdQuery } from "@/queries/user/useGetUserByIdQuery";
import { UserForm } from "../../components/user-form";

type EditUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditUserPage({ params }: EditUserPageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const { data: user, isLoading } = useGetUserByIdQuery(id);

  if (!id) {
    return (
      <section className="flex flex-col gap-4">
        <Link href="/users" className="flex items-center gap-0.5 text-primary">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-sm">Back to Users</p>
        </Link>
        <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
          <PageHeader
            title="Edit User"
            description="Update user information and assigned roles"
          />
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Loading user...
          </div>
        </section>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="flex flex-col gap-4">
        <Link href="/users" className="flex items-center gap-0.5 text-primary">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-sm">Back to Users</p>
        </Link>
        <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
          <PageHeader
            title="Edit User"
            description="Update user information and assigned roles"
          />
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            {isLoading ? "Loading user..." : "User not found"}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Link href="/users" className="flex items-center gap-0.5 text-primary">
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Users</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Edit User"
          description="Update user information and assigned roles"
        />
        <UserForm user={user} isEdit={true} />
      </section>
    </section>
  );
}
