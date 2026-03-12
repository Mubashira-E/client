"use client";

import type { MedicalDepartmentRequest } from "@/queries/general/medical-department/useCreateMedicalDepartmentMutationQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createMedicalDepartmentSchema, useCreateMedicalDepartmentMutation } from "@/queries/general/medical-department/useCreateMedicalDepartmentMutationQuery";
import { useGetMedicalDepartmentByIdQuery } from "@/queries/general/medical-department/useGetMedicalDepartmentByIdQuery";
import { useUpdateMedicalDepartmentMutation } from "@/queries/general/medical-department/useUpdateMedicalDepartmentMutation";
import MedicalDepartmentFormLoader from "./add-medical-department-form-loader";

export function AddMedicalDepartmentForm({ medicalDepartmentId }: { medicalDepartmentId?: string }) {
  const router = useRouter();

  const form = useForm<MedicalDepartmentRequest>({
    resolver: zodResolver(createMedicalDepartmentSchema),
    defaultValues: {
      medicalDepartmentName: "",
    },
  });

  const { mutate: createMedicalDepartment, isPending: isCreating, error: createError, isSuccess: isCreateSuccess } = useCreateMedicalDepartmentMutation();
  const { mutate: updateMedicalDepartment, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateMedicalDepartmentMutation(medicalDepartmentId as string);

  const { data: medicalDepartmentData, isPending: isLoadingGetMedicalDepartment } = useGetMedicalDepartmentByIdQuery(medicalDepartmentId as string);

  useEffect(() => {
    if (medicalDepartmentData) {
      form.setValue("medicalDepartmentName", medicalDepartmentData.medicalDepartmentName);
    }
  }, [medicalDepartmentData, form]);

  async function onSubmit(data: MedicalDepartmentRequest) {
    if (medicalDepartmentId) {
      updateMedicalDepartment(data);
    }
    else {
      createMedicalDepartment(data);
    }
  }

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Medical department created successfully");
      form.reset();
      router.push("/masters/clinician-management?tab=department");
    }
  }, [isCreateSuccess, form, router]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Medical department updated successfully");
      router.push("/masters/clinician-management?tab=department");
    }
  }, [isUpdateSuccess, router]);

  useEffect(() => {
    if (createError || updateError) {
      const error = createError || updateError;
      toast.error("Failed to save medical department", {
        description: error instanceof AxiosError ? error.response?.data.message : "Unknown error",
      });
    }
  }, [createError, updateError]);

  if (medicalDepartmentId && isLoadingGetMedicalDepartment) {
    return <MedicalDepartmentFormLoader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="medicalDepartmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Department
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Medical Department Name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the medical department</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/masters/clinician-management?tab=department")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {medicalDepartmentId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
