"use client";

import type { ApiErrorResponse } from "@/types/api-error";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AlertCircle, Mail, Save, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetAllRoleQuery } from "@/queries/general/roles/useGetAllRoleQuery";
import { useCreateUserMutation } from "@/queries/user/useCreateUserMutation";
import { useUpdateUserMutation } from "@/queries/user/useUpdateUserMutation";

function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    if (apiError?.message) {
      return apiError.message;
    }
    if (apiError?.detail) {
      return apiError.detail;
    }
    return "Error saving user";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
});

const createUserSchema = baseUserSchema.extend({
  password: z.string().min(1, "Password is required"),
});

const updateUserSchema = baseUserSchema.extend({
  password: z.string().optional(),
});

type UserFormValues =
  | z.infer<typeof createUserSchema>
  | z.infer<typeof updateUserSchema>;

type UserFormProps = {
  user?: User;
  onDelete?: (userId: string) => void;
  isEdit?: boolean;
};

export function UserForm({ user, onDelete, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const { roles, isLoading: isLoadingRoles } = useGetAllRoleQuery({
    PageSize: 100,
  });

  const {
    mutate: createUser,
    isPending: isCreating,
    error: createError,
    isSuccess: isCreateSuccess,
  } = useCreateUserMutation();
  const {
    mutate: updateUser,
    isPending: isUpdating,
    error: updateError,
    isSuccess: isUpdateSuccess,
  } = useUpdateUserMutation();

  const formSchema = isEdit ? updateUserSchema : createUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [],
    },
  });

  useEffect(() => {
    if (user && roles.length > 0) {
      const mappedRoleIds = (user.roles || [])
        .map((userRole) => {
          const roleById = roles.find(r => r.roleId === userRole);
          if (roleById)
            return userRole;

          const roleByName = roles.find(r => r.name === userRole);
          return roleByName ? roleByName.roleId : null;
        })
        .filter((id): id is string => id !== null);

      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        roles: mappedRoleIds,
      });
    }
  }, [user, form, roles]);

  useEffect(() => {
    if (isCreateSuccess) {
      form.reset();
      router.push("/users");
    }
  }, [isCreateSuccess, router, form]);

  useEffect(() => {
    if (isUpdateSuccess) {
      router.push("/users");
    }
  }, [isUpdateSuccess, router]);

  useEffect(() => {
    if (!(createError || updateError)) {
      return;
    }

    const error = createError || updateError;

    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse;

      if (Array.isArray(apiError?.errors) && apiError.errors.length) {
        apiError.errors.forEach(({ property, message }) => {
          if (!property || !message) {
            return;
          }
          const fieldName
            = property.charAt(0).toLowerCase() + property.slice(1);
          form.setError(fieldName as any, {
            type: "server",
            message,
          });
        });
        return;
      }

      if (apiError?.type === "VALIDATION_ERROR") {
        const validationMessage
          = apiError.detail || apiError.title || "Validation error";
        form.setError("root", {
          type: "server",
          message: validationMessage,
        });
        return;
      }

      toast.error(parseApiError(error));
      return;
    }

    toast.error(parseApiError(error));
  }, [createError, updateError, form]);

  function onSubmit(data: UserFormValues) {
    if (isEdit && user) {
      updateUser({
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleIDs: data.roles,
        newPassword: data.password || undefined,
      });
    }
    else {
      createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleIDs: data.roles,
        password: data.password!,
      });
    }
  }

  const handleDelete = () => {
    if (user && onDelete) {
      onDelete(user.id);
      router.push("/users");
    }
  };

  return (
    <section
      className={`flex flex-col gap-4 bg-white rounded-md ${
        isEdit ? "p-4 border" : ""
      }`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {isEdit && `${user?.firstName} ${user?.lastName}`}
                  </h1>
                </div>
              </div>
            </div>
            {isEdit && user && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                  >
                    <Trash2 className="size-4 text-red-600" />
                    Remove User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove "
                      {user.firstName}
                      {" "}
                      {user.lastName}
                      "? This action cannot be undone and will remove this
                      user's access to the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {isEdit && user && user.status === "pending" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="size-5 text-amber-400" />
              <p className="text-sm text-foreground">
                This user has not yet activated their account.
              </p>
            </div>
          )}

          {form.formState.errors.root?.message && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-medium text-foreground">
                    User Details
                  </h2>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            type="email"
                            className="bg-white"
                            disabled={isEdit}
                            {...field}
                          />
                        </FormControl>
                        {isEdit && (
                          <FormDescription>
                            Email cannot be changed after user creation.
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            type="password"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isEdit && user && (
                <div className="rounded-lg border border-border p-6 space-y-4">
                  <h2 className="text-lg font-medium text-foreground">
                    User Statistics
                  </h2>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant="outline"
                        className={
                          user.status.toLowerCase() === "active"
                            ? "bg-primary text-primary-foreground border-primary/30"
                            : user.status.toLowerCase() === "pending"
                              ? "bg-yellow-500 text-white border-border"
                              : "bg-red-500 text-white border-border"
                        }
                      >
                        {user.status.charAt(0).toUpperCase()
                          + user.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Assigned Roles
                      </p>
                      <p className="text-2xl font-semibold text-foreground pl-8">
                        {form.watch("roles")?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isEdit && (
                <div className="rounded-lg border border-border p-6 space-y-4">
                  <h2 className="text-lg font-medium text-foreground">
                    Roles Summary
                  </h2>
                  <div className="p-4 rounded-lg bg-secondary">
                    <p className="text-2xl font-semibold text-foreground">
                      {form.watch("roles")?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Roles Selected
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-medium text-foreground">
                      Assign Roles
                    </h2>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {form.watch("roles")?.length || 0}
                    {" "}
                    /
                    {roles.length}
                    {" "}
                    selected
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      {isLoadingRoles
                        ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              Loading roles...
                            </div>
                          )
                        : (
                            <div className="border border-border rounded-lg divide-y divide-border max-h-[500px] overflow-auto">
                              {roles.map(role => (
                                <FormField
                                  key={role.roleId}
                                  control={form.control}
                                  name="roles"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={role.roleId}
                                        className="flex flex-row items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              role.roleId,
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    role.roleId,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      value =>
                                                        value !== role.roleId,
                                                    ),
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <div className="flex-1 min-w-0">
                                          <FormLabel className="font-normal cursor-pointer w-full block">
                                            <div className="flex items-center gap-2">
                                              <p className="font-medium text-sm">
                                                {role.name}
                                              </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                              {role.description}
                                            </p>
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Link href="/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="gap-2"
            >
              <Save className="size-4" />
              {isEdit ? "Update User" : "Add User"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
