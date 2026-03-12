"use client";

import type {
  PermissionResponse,
  RoleDetailResponse,
  UpdateRoleRequest,
} from "@/types/role";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllPermissionsQuery } from "@/queries/general/roles/useGetAllPermissionQuery";
import { PermissionSkeleton } from "./permission-skeleton";

type RoleFormProps = {
  role?: RoleDetailResponse;
  onSave: (role: UpdateRoleRequest) => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
};

export function RoleForm({
  role,
  onSave,
  isEdit = false,
  isSubmitting = false,
}: RoleFormProps) {
  const { permissions: apiPermissions, isLoading: isLoadingPermissions }
    = useGetAllPermissionsQuery();

  const permissions = apiPermissions;

  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [notes, setNotes] = useState(role?.notes || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions.map(p => p.permissionId) || [],
  );
  const [isActive, setIsActive] = useState<boolean>(
    role ? role.status === "Active" || role.status === "active" : true,
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setNotes(role.notes || "");
      setSelectedPermissions(role.permissions.map(p => p.permissionId));
      setIsActive(role.status === "Active" || role.status === "active");
      setHasChanges(false);
    }
  }, [role]);

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.moduleName]) {
      acc[permission.moduleName] = [];
    }
    acc[permission.moduleName].push(permission);
    return acc;
  }, {} as Record<string, PermissionResponse[]>);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId],
    );
    setHasChanges(true);
  };

  const handleCategoryToggle = (category: string, enabled: boolean) => {
    const categoryPermissionIds = permissionsByCategory[category].map(
      p => p.permissionId,
    );
    if (enabled) {
      setSelectedPermissions(prev => [
        ...new Set([...prev, ...categoryPermissionIds]),
      ]);
    }
    else {
      setSelectedPermissions(prev =>
        prev.filter(p => !categoryPermissionIds.includes(p)),
      );
    }
    setHasChanges(true);
  };

  const isCategoryFullyEnabled = (category: string) => {
    return permissionsByCategory[category].every(p =>
      selectedPermissions.includes(p.permissionId),
    );
  };

  const isCategoryPartiallyEnabled = (category: string) => {
    const categoryPermissions = permissionsByCategory[category];
    const enabledCount = categoryPermissions.filter(p =>
      selectedPermissions.includes(p.permissionId),
    ).length;
    return enabledCount > 0 && enabledCount < categoryPermissions.length;
  };

  const handleSave = () => {
    if (isEdit && role) {
      onSave({
        name,
        description,
        notes,
        permissionIds: selectedPermissions,
      });
    }
    else {
      onSave({
        name,
        description,
        notes,
        permissionIds: selectedPermissions,
      });
    }
  };

  return (
    <section
      className={`flex flex-col gap-4 bg-white rounded-md ${
        isEdit ? "p-4 border" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {isEdit && role?.name}
              </h1>
            </div>
            {isEdit && role && (
              <p className="text-muted-foreground mt-1">
                Created on
                {" "}
                {new Date().toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              Role Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setHasChanges(true);
                  }}
                  className="bg-white"
                  placeholder="e.g., Senior Vaidya"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setHasChanges(true);
                  }}
                  className="bg-white resize-none"
                  rows={3}
                  placeholder="Describe what this role is for..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setHasChanges(true);
                  }}
                  className="bg-white resize-none"
                  rows={3}
                  placeholder="Additional notes about this role..."
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="active-status" className="text-base">
                    Active Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isActive
                      ? "This role is currently active and can be assigned to users"
                      : "This role is inactive and cannot be assigned to new users"}
                  </p>
                </div>
                <Switch
                  id="active-status"
                  checked={isActive}
                  onCheckedChange={(checked) => {
                    setIsActive(checked);
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>
          </div>

          {isEdit && role && (
            <div className="rounded-lg border border-border p-6 space-y-4">
              <h2 className="text-lg font-medium text-foreground">
                Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-2xl font-semibold text-foreground">N/A</p>
                  <p className="text-sm text-muted-foreground">
                    Assigned Users
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-2xl font-semibold text-foreground">
                    {selectedPermissions.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Permissions</p>
                </div>
              </div>
            </div>
          )}

          {!isEdit && (
            <div className="rounded-lg border border-border p-6 space-y-4">
              <h2 className="text-lg font-medium text-foreground">
                Permissions Summary
              </h2>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-semibold text-foreground">
                  {selectedPermissions.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Selected Permissions
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">
                Permissions
              </h2>
              <Badge variant="secondary" className="font-mono">
                {selectedPermissions.length}
                {" "}
                /
                {permissions.length}
                {" "}
                enabled
              </Badge>
            </div>

            <div className="space-y-6">
              {isLoadingPermissions
                ? (
                    <PermissionSkeleton />
                  )
                : (
                    Object.entries(permissionsByCategory).map(
                      ([category, categoryPermissions]) => (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-border">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium text-foreground">
                                {category}
                              </h3>
                              {isCategoryPartiallyEnabled(category) && (
                                <Badge variant="outline" className="text-xs">
                                  Partial
                                </Badge>
                              )}
                            </div>
                            <Switch
                              checked={isCategoryFullyEnabled(category)}
                              onCheckedChange={checked =>
                                handleCategoryToggle(category, checked)}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryPermissions.map(permission => (
                              <div
                                key={permission.permissionId}
                                className="flex items-center justify-between p-3 rounded-lg border transition-colors border-primary bg-white"
                              >
                                <div className="space-y-0.5">
                                  <p className="text-sm font-medium text-foreground">
                                    {permission.action.split(".").pop()}
                                  </p>
                                </div>
                                <Switch
                                  checked={selectedPermissions.includes(
                                    permission.permissionId,
                                  )}
                                  onCheckedChange={() =>
                                    handlePermissionToggle(permission.permissionId)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )
                  )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Button
          onClick={handleSave}
          disabled={(isEdit && !hasChanges) || isSubmitting}
          className="gap-2"
        >
          <Save className="size-4" />
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Role"
              : "Create Role"}
        </Button>
      </div>
    </section>
  );
}
