"use client";

import type { ClinicianRequest } from "@/queries/clinician/useCreateClinicianMutation";
import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { createClinicianSchema, useCreateClinicianMutation } from "@/queries/clinician/useCreateClinicianMutation";
import { useGetClinicianByIdQuery } from "@/queries/clinician/useGetClinicianByIdQuery";
import { useUpdateClinicianMutation } from "@/queries/clinician/useUpdateClinicianMutation";
import { useGetAllMedicalDepartmentQuery } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";
import ClinicianFormLoader from "./add-clinician-form-loader";

export function AddClinicianForm({ clinicianId }: { clinicianId?: string }) {
  const router = useRouter();

  const form = useForm<ClinicianRequest>({
    resolver: zodResolver(createClinicianSchema),
    defaultValues: {
      clinicianCode: "",
      clinician: "",
      profession: "",
      major: "",
      medicalDepartmentId: "",
    },
  });

  const { mutate: createClinician, isPending: isCreating, error, isSuccess } = useCreateClinicianMutation();

  const { data: clinicianData, isPending: isLoadingGetClinician } = useGetClinicianByIdQuery(clinicianId || "");

  // Fetch medical departments for dropdown
  const { medicalDepartments, isPending: isLoadingDepartments } = useGetAllMedicalDepartmentQuery({
    pageSize: 999,
    pageNumber: 1,
  });

  useEffect(() => {
    if (clinicianData) {
      form.reset({
        clinicianCode: clinicianData.clinicianCode || "",
        clinician: clinicianData.clinician ?? clinicianData.clinicianName ?? "",
        profession: clinicianData.profession || "",
        major: clinicianData.major || "",
        medicalDepartmentId: clinicianData.medicalDepartmentId || "",
      });
    }
  }, [clinicianData, form]);

  const { mutate: updateClinician, isPending: isUpdating, isSuccess: isUpdateSuccess, error: updateError } = useUpdateClinicianMutation(
    clinicianId || "",
  );

  async function onSubmit(data: ClinicianRequest) {
    if (clinicianId) {
      updateClinician(data);
    }
    else {
      createClinician(data);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Clinician Created Successfully", {
        description: `Clinician "${form.getValues("clinician")}" has been created`,
      });
      form.reset();
      router.push("/masters/clinician-management?tab=clinician");
    }
  }, [isSuccess, form, router]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Clinician Updated Successfully", {
        description: `Clinician "${form.getValues("clinician")}" has been updated`,
      });
      form.reset();
      router.push("/masters/clinician-management?tab=clinician");
    }
  }, [isUpdateSuccess, form, router]);

  useEffect(() => {
    if (!(error || updateError)) {
      return;
    }

    const currentError = error || updateError;
    const actionLabel = updateError ? "update" : "create";

    if (currentError instanceof AxiosError) {
      const apiError = currentError.response?.data as ApiErrorResponse;

      if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
        apiError.errors.forEach(({ property, message }) => {
          if (!property || !message) {
            return;
          }
          form.setError(property as keyof ClinicianRequest, {
            type: "server",
            message,
          });
        });
        return;
      }

      if (apiError?.type === "VALIDATION_ERROR") {
        const validationMessage = apiError.detail || apiError.title || "Please review the highlighted fields.";
        form.setError("root", {
          type: "server",
          message: validationMessage,
        });
        return;
      }

      const errorMessage = apiError?.detail || apiError?.title || apiError?.message || `Failed to ${actionLabel} clinician`;
      toast.error(`Failed to ${actionLabel} clinician`, {
        description: errorMessage,
      });
      return;
    }

    toast.error(`Failed to ${updateError ? "update" : "create"} clinician`, {
      description: "Unknown error occurred",
    });
  }, [error, updateError, form]);

  if (clinicianId && isLoadingGetClinician) {
    return <ClinicianFormLoader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {form.formState.errors.root?.message && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="clinicianCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Clinician Code
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Clinician Code" {...field} />
              </FormControl>
              <FormDescription>Unique identifier for the clinician</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clinician"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Clinician Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Clinician Name" {...field} />
              </FormControl>
              <FormDescription>Name of the clinician</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession</FormLabel>
              <FormControl>
                <Input placeholder="Enter Profession" {...field} />
              </FormControl>
              <FormDescription>Clinician profession</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major</FormLabel>
              <FormControl>
                <Input placeholder="Enter Major" {...field} />
              </FormControl>
              <FormDescription>Clinician major</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalDepartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Medical Department
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingDepartments}
                key={field.value || "no-value"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingDepartments ? "Loading departments..." : "Select a department"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {medicalDepartments.map(dept => (
                    <SelectItem key={dept.medicalDepartmentId} value={dept.medicalDepartmentId}>
                      {dept.medicalDepartmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the medical department for this clinician</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/masters/clinician-management?tab=clinician")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {clinicianId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
