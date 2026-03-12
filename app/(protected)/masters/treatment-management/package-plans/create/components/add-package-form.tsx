"use client";

import type { AxiosError } from "axios";
import type { PackageRequest } from "@/queries/masters/package-plans/useCreatePackageMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createPackageSchema, useCreatePackageMutation } from "@/queries/masters/package-plans/useCreatePackageMutation";
import { useGetDurationUnitsQuery } from "@/queries/masters/package-plans/useGetDurationUnitsQuery";
import { useGetPackageByIdQuery } from "@/queries/masters/package-plans/useGetPackageByIdQuery";
import { useUpdatePackageMutation } from "@/queries/masters/package-plans/useUpdatePackageMutation";
import { useGetAllTreatmentQuery } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
import { AddPackageFormLoader } from "./add-package-form-loader";

type AddPackageFormProps = {
  packageId?: string;
};

export function AddPackageForm({ packageId }: AddPackageFormProps) {
  const router = useRouter();

  const form = useForm<PackageRequest>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      packageCode: "",
      packageName: "",
      price: undefined,
      description: "",
      duration: undefined,
      durationUnit: undefined,
      notes: "",
      treatmentIds: [],
    },
  });

  const { treatments, isPending: isLoadingTreatments } = useGetAllTreatmentQuery({
    PageSize: 999,
    PageNumber: 1,
    SearchTerms: "",
    SortOrderBy: true,
    Status: 1,
  });
  const { data: durationUnits, isPending: isLoadingDurationUnits } = useGetDurationUnitsQuery();

  const treatmentOptions = useMemo(
    () =>
      (treatments ?? []).map((item: { treatmentId: string; treatmentName: string }) => ({
        value: item.treatmentId,
        label: item.treatmentName,
      })),
    [treatments],
  );

  const durationUnitOptions = useMemo(
    () =>
      (durationUnits ?? []).map((item: { id: number; name: string }) => ({
        value: item.id,
        label: item.name,
      })),
    [durationUnits],
  );

  const { data: packageData, isPending: isLoadingPackage } = useGetPackageByIdQuery(packageId as string);

  useEffect(() => {
    if (packageData) {
      form.setValue("packageCode", packageData.packageCode || "");
      form.setValue("packageName", packageData.packageName);
      form.setValue("price", packageData.price || 0);
      form.setValue("description", packageData.description || "");
      form.setValue("duration", packageData.duration || packageData.durationPerSession || 0);
      // Map durationUnit string to number if needed
      const durationUnit = durationUnitOptions.find(
        (opt: { value: number; label: string }) => opt.label === packageData.durationUnit,
      );
      if (durationUnit) {
        form.setValue("durationUnit", durationUnit.value);
      }
      form.setValue("notes", packageData.notes || "");

      // Set treatment IDs - store the full data for update
      if (packageData.treatments) {
        form.setValue(
          "treatmentIds",
          packageData.treatments.map((t: { treatmentId: string; treatmentPackageId?: string; treatmentPrice?: number }) => ({
            treatmentId: t.treatmentId,
            // Store additional data for update
            id: t.treatmentPackageId,
            price: t.treatmentPrice,
          })),
        );
      }
    }
  }, [packageData, form, durationUnitOptions]);

  const { mutate: createPackage, isPending: isCreating } = useCreatePackageMutation({
    onSuccess: () => {
      toast.success("Package created successfully", {
        description: `Package "${form.getValues("packageName")}" has been created.`,
      });
      form.reset();
      router.push("/masters/treatment-management?tab=package-plans");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Unknown error occurred";
      toast.error("Error creating package", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updatePackage, isPending: isUpdating } = useUpdatePackageMutation(packageId as string, {
    onSuccess: () => {
      toast.success("Package updated successfully", {
        description: `Package "${form.getValues("packageName")}" has been updated.`,
      });
      form.reset();
      router.push("/masters/treatment-management?tab=package-plans");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Unknown error occurred";
      toast.error("Error updating package", {
        description: errorMessage,
      });
    },
  });

  async function onSubmit(data: PackageRequest) {
    if (packageId) {
      // For update, transform the data to match update API structure
      const updateData = {
        packageCode: data.packageCode || "",
        packageName: data.packageName,
        price: data.price,
        description: data.description || "",
        duration: data.duration,
        durationUnit: data.durationUnit,
        notes: data.notes || "",
        treatmentIds: data.treatmentIds.map((t: any) => ({
          id: t.id, // treatmentPackageId if exists
          treatmentId: t.treatmentId,
          price: t.price || 0,
          isActive: true,
        })),
      };
      updatePackage(updateData);
    }
    else {
      createPackage(data);
    }
  }

  if (packageId && isLoadingPackage) {
    return <AddPackageFormLoader />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
              <CardDescription>
                Enter the details of the package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packageCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., PKG-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Package Name
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Complete Wellness Package"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the package"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Price (AED)
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1000.00"
                          name={field.name}
                          value={field.value === undefined || Number.isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              field.onChange(undefined);
                              return;
                            }
                            const parsed = Number.parseFloat(raw);
                            field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                          }}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-2">
                  <FormLabel>
                    Duration & Unit
                    {" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex items-start">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="flex-none w-[100px]">
                          <Select
                            key={field.value}
                            onValueChange={value => field.onChange(Number.parseInt(value, 10))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-r-none focus:ring-0 focus:border-primary relative z-0 focus:z-10">
                                <SelectValue placeholder="0" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select
                            key={field.value}
                            onValueChange={value => field.onChange(Number.parseInt(value, 10))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-l-none -ml-px focus:ring-0 focus:border-primary relative z-0 focus:z-10">
                                <SelectValue placeholder={isLoadingDurationUnits ? "Loading..." : "Select unit"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {durationUnitOptions.map((option: { value: number; label: string }) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Treatments */}
          <Card>
            <CardHeader>
              <CardTitle>Package Components</CardTitle>
              <CardDescription>
                Select treatments for this package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="treatmentIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Treatments
                      {" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={treatmentOptions}
                        onValueChange={(selectedIds) => {
                          const current = field.value ?? [];
                          field.onChange(
                            selectedIds.map((id) => {
                              const existing = current.find((t: any) => t.treatmentId === id);
                              return existing || { treatmentId: id };
                            }),
                          );
                        }}
                        defaultValue={(field.value ?? []).map((t: any) => t.treatmentId)}
                        placeholder={isLoadingTreatments ? "Loading treatments..." : "Select treatments"}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or remarks about this package"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/masters/treatment-management?tab=package-plans")}
              disabled={isCreating || isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating && "Creating..."}
              {isUpdating && "Updating..."}
              {!isCreating && !isUpdating && (packageId ? "Update Package" : "Create Package")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
