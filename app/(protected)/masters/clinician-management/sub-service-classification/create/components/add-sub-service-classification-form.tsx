"use client";

import type { CreateSubServiceClassificationPayload } from "@/queries/masters/sub-service-classification/useCreateSubServiceClassificationMutationQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useGetServiceClassificationQuery } from "@/queries/general/service-classification/useGetServiceClassification";
import { createSubServiceClassificationSchema, useCreateSubServiceClassificationMutation } from "@/queries/masters/sub-service-classification/useCreateSubServiceClassificationMutationQuery";
import { useGetSubServiceClassificationByIdQuery } from "@/queries/masters/sub-service-classification/useGetSubServiceClassificationByIdQuery";
import { useUpdateSubServiceClassificationMutation } from "@/queries/masters/sub-service-classification/useUpdateSubServiceClassificationMutationQuery";
import SubServiceClassificationFormLoader from "./add-sub-service-classification-form-loader";

export function AddSubServiceClassificationForm({ subServiceClassificationId }: { subServiceClassificationId?: string }) {
  const router = useRouter();

  const form = useForm<CreateSubServiceClassificationPayload>({
    resolver: zodResolver(createSubServiceClassificationSchema),
    defaultValues: {
      subServiceClassification: "",
      serviceClassificationID: 0,
      isDrug: false,
      vatPercentage: 0,
    },
    mode: "onChange",
  });
  const { mutate: createSubServiceClassification, isPending: isCreating, error, isSuccess } = useCreateSubServiceClassificationMutation();

  const { data: subServiceClassificationData, isPending: isLoadingGetSubServiceClassification, error: fetchError } = useGetSubServiceClassificationByIdQuery(subServiceClassificationId || "");

  const { data: serviceClassificationsResponse } = useGetServiceClassificationQuery({
    pageSize: 999,
    sortDirection: "asc",
  });

  useEffect(() => {
    if (subServiceClassificationData) {
      const serviceClassificationId = Number.parseInt(subServiceClassificationData.serviceClassificationId, 10);

      // Use setTimeout to ensure form is ready
      const timeoutId = setTimeout(() => {
        form.setValue("subServiceClassification", subServiceClassificationData.subServiceClassification);
        form.setValue("serviceClassificationID", serviceClassificationId);
        form.setValue("isDrug", subServiceClassificationData.isDrug);
        form.setValue("vatPercentage", subServiceClassificationData.vatPercentage);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [subServiceClassificationData, form]);

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching sub-service classification:", fetchError);
    }
  }, [fetchError]);

  const { mutate: updateSubServiceClassification, isPending: isUpdating, isSuccess: isUpdateSuccess, error: updateError } = useUpdateSubServiceClassificationMutation();

  async function onSubmit(data: CreateSubServiceClassificationPayload) {
    if (subServiceClassificationId) {
      updateSubServiceClassification({ ...data, id: subServiceClassificationId });
    }
    else {
      createSubServiceClassification(data);
    }
  }

  useEffect(() => {
    if (isSuccess && !subServiceClassificationId) {
      toast.success("Sub service classification created successfully", {
        description: `Created "${form.getValues("subServiceClassification")}"`,
      });
      form.reset();
      router.push("/masters/clinician-management?tab=consultation-sub-service-classification");
    }
  }, [isSuccess, form, router, subServiceClassificationId]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Sub service classification updated successfully", {
        description: `Updated "${form.getValues("subServiceClassification")}"`,
      });
      router.push("/masters/clinician-management?tab=consultation-sub-service-classification");
    }
  }, [isUpdateSuccess, form, router]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to create sub service classification", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }, [error]);

  useEffect(() => {
    if (updateError) {
      toast.error("Failed to update sub service classification", {
        description: updateError instanceof Error ? updateError.message : "An unknown error occurred",
      });
    }
  }, [updateError]);

  if (subServiceClassificationId && isLoadingGetSubServiceClassification) {
    return <SubServiceClassificationFormLoader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="subServiceClassification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sub Service Classification
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Sub Service Classification Name"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>Enter the name of the sub service classification</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceClassificationID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Service Classification
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={value => field.onChange(Number.parseInt(value, 10))}
                value={field.value && !Number.isNaN(field.value) ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service classification" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceClassificationsResponse?.data?.map(serviceClassification => (
                    <SelectItem key={serviceClassification.serviceClassificationId} value={serviceClassification.serviceClassificationId.toString()}>
                      {serviceClassification.serviceClassification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose the parent service classification</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDrug"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Is Drug
                </FormLabel>
                <FormDescription>
                  Check if this sub service classification is related to drugs
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vatPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                VAT Percentage
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter VAT percentage"
                  value={field.value || ""}
                  onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>Enter the VAT percentage for this sub service classification</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/masters/clinician-management?tab=consultation-sub-service-classification")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {subServiceClassificationId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
