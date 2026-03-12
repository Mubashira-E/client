"use client";

import type { UpdateRoleRequest } from "@/types/role";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { useCreateRoleMutation } from "@/queries/general/roles/useCreateRoleMutation";
import { RoleForm } from "../components/role-form";

export default function CreateRolePage() {
  const router = useRouter();
  const createRoleMutation = useCreateRoleMutation({
    onSuccess: () => {
      toast.success("Role created successfully");
      router.push("/roles");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });

  const handleCreateRole = (roleInput: UpdateRoleRequest) => {
    createRoleMutation.mutate({
      name: roleInput.name,
      description: roleInput.description || "",
      notes: roleInput.notes || "",
      permissionIds: roleInput.permissionIds,
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <Link href="/roles" className="flex items-center gap-0.5 text-primary">
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Roles</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Role"
          description="Define a new role with specific permissions for your team"
        />
        <RoleForm
          onSave={handleCreateRole}
          isEdit={false}
          isSubmitting={createRoleMutation.isPending}
        />
      </section>
    </section>
  );
}
