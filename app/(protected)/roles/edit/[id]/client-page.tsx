"use client";

import type { UpdateRoleRequest } from "@/types/role";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import { useGetRoleByIdQuery } from "@/queries/general/roles/useGetRoleByIdQuery";
import { useUpdateRoleMutation } from "@/queries/general/roles/useUpdateRoleMutation";
import { RoleForm } from "../../components/role-form";
import EditRoleLoading from "./loading";

type EditRolePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditRolePage({ params }: EditRolePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const roleId = resolvedParams.id;

  const { data: roleDetail, isLoading, isError } = useGetRoleByIdQuery(roleId);
  const updateRoleMutation = useUpdateRoleMutation(roleId, {
    onSuccess: () => {
      toast.success("Role updated successfully");
      router.push("/roles");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  const handleUpdateRole = (updatedRole: UpdateRoleRequest) => {
    updateRoleMutation.mutate(updatedRole);
  };

  if (isLoading) {
    return <EditRoleLoading />;
  }

  if (isError || !roleDetail) {
    return (
      <section className="flex flex-col gap-4">
        <Link href="/roles" className="flex items-center gap-0.5 text-primary">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-sm">Back to Roles</p>
        </Link>
        <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Edit Role</h1>
            <p className="text-muted-foreground">
              Update role information and permissions
            </p>
          </div>
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Role not found
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Link href="/roles" className="flex items-center gap-0.5 text-primary">
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Roles</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Edit Role</h1>
          <p className="text-muted-foreground">
            Update role information and permissions
          </p>
        </div>
        <RoleForm
          key={roleDetail.roleId}
          role={roleDetail}
          onSave={handleUpdateRole}
          isEdit={true}
          isSubmitting={updateRoleMutation.isPending}
        />
      </section>
    </section>
  );
}
