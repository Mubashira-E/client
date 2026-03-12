"use client";

import type React from "react";
import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllPackageQuery } from "@/queries/masters/package-plans/useGetAllPackageQuery";
import { useGetDurationUnitsQuery } from "@/queries/masters/package-plans/useGetDurationUnitsQuery";
import { useGetAllTreatmentQuery } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
import { useCreateWellnessProgramMutation } from "@/queries/masters/wellness-program/useCreateWellnessProgramMutation";
import { useGetWellnessProgramByIdQuery } from "@/queries/masters/wellness-program/useGetWellnessProgramByIdQuery";
import { useUpdateWellnessProgramMutation } from "@/queries/masters/wellness-program/useUpdateWellnessProgramMutation";
import { AddWellnessProgramFormLoader } from "./add-wellness-program-form-loader";

const wellnessProgramSchema = z.object({
  wellnessProgramCode: z.string().trim().min(1, { message: "Wellness Program Code is required" }),
  wellnessProgramName: z.string().trim().min(1, { message: "Wellness Program Name is required" }),
  description: z.string().trim().optional(),
  selectedPackages: z.array(z.string()).optional(),
  selectedTreatments: z.array(z.string()).optional(),
  duration: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration must be greater than 0" }).optional(),
  ) as unknown as z.ZodOptional<z.ZodNumber>,
  durationUnit: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Duration unit is required" }).optional(),
  ) as unknown as z.ZodOptional<z.ZodNumber>,
  price: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Price must be 0 or greater" }),
  ) as unknown as z.ZodNumber,
  notes: z.string().trim().optional(),
}).superRefine((data, ctx) => {
  if ((data.selectedPackages?.length ?? 0) === 0 && (data.selectedTreatments?.length ?? 0) === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one package or treatment",
      path: ["selectedTreatments"],
    });
  }
});

type WellnessProgramFormValues = z.infer<typeof wellnessProgramSchema>;

function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    if (apiError?.message) {
      return apiError.message;
    }
    if (apiError?.detail) {
      return apiError.detail;
    }
    return "Error saving wellness program";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function AddWellnessProgramForm({ wellnessProgramId }: { wellnessProgramId?: string }) {
  const router = useRouter();

  const { packages, isPending: isLoadingPackages } = useGetAllPackageQuery({
    PageSize: 999,
    PageNumber: 1,
    SearchTerms: "",
    SortOrderBy: true,
    Status: 1,
  });

  const { treatments, isPending: isLoadingTreatments } = useGetAllTreatmentQuery({
    PageSize: 999,
    PageNumber: 1,
    Status: 1,
  });

  const { data: durationUnits, isPending: isLoadingDurationUnits } = useGetDurationUnitsQuery();

  const { mutate: createWellnessProgram, isPending: isCreating, error: createError, isSuccess: isCreateSuccess } = useCreateWellnessProgramMutation();
  const { mutate: updateWellnessProgram, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateWellnessProgramMutation(wellnessProgramId as string);

  const { data: wellnessProgram, isPending: isLoadingGetWellnessProgram } = useGetWellnessProgramByIdQuery(wellnessProgramId as string);

  const form = useForm<WellnessProgramFormValues>({
    resolver: zodResolver(wellnessProgramSchema),
    defaultValues: {
      wellnessProgramCode: "",
      wellnessProgramName: "",
      description: "",
      selectedPackages: [],
      selectedTreatments: [],
      duration: undefined,
      durationUnit: undefined,
      price: undefined,
      notes: "",
    },
  });

  const packageOptions = useMemo(() => {
    return (packages ?? [])
      .map((pkg: any) => ({
        value: pkg.packageId,
        label: `${pkg.packageName}`,
      }));
  }, [packages]);

  const treatmentOptions = useMemo(() => {
    return treatments
      .map(treatment => ({
        value: treatment.treatmentId,
        label: `${treatment.treatmentName}`,
      }));
  }, [treatments]);

  const durationUnitOptions = useMemo(() => {
    return (durationUnits ?? []).map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }, [durationUnits]);

  useEffect(() => {
    if (wellnessProgram) {
      form.setValue("wellnessProgramCode", wellnessProgram.wellnessProgramCode);
      form.setValue("wellnessProgramName", wellnessProgram.wellnessProgramName);
      form.setValue("description", wellnessProgram.description || "");
      form.setValue("duration", wellnessProgram.duration || undefined);

      const durationUnit = durationUnitOptions.find(
        (opt: { value: number; label: string }) => opt.label === wellnessProgram.durationUnit,
      );
      if (durationUnit) {
        form.setValue("durationUnit", durationUnit.value);
      }

      form.setValue("price", wellnessProgram.price);
      form.setValue("notes", wellnessProgram.notes || "");

      const activeTreatmentIds = wellnessProgram.treatments
        .filter(t => t.status === "Active")
        .map(t => t.treatmentId);
      form.setValue("selectedTreatments", activeTreatmentIds);

      const activePackageIds = wellnessProgram.packages
        .filter(p => p.status === "Active")
        .map(p => p.packageId);
      form.setValue("selectedPackages", activePackageIds);
    }
  }, [wellnessProgram, form, durationUnitOptions]);

  const handleSubmit = form.handleSubmit((data) => {
    if (wellnessProgramId) {
      const existingTreatmentIds = wellnessProgram?.treatments.map(t => ({
        id: t.wellnessProgramTreatmentId,
        treatmentId: t.treatmentId,
        isActive: (data.selectedTreatments || []).includes(t.treatmentId),
      })) || [];

      const newTreatmentIds = (data.selectedTreatments || [])
        .filter(tid => !existingTreatmentIds.some(et => et.treatmentId === tid))
        .map(tid => ({
          id: "00000000-0000-0000-0000-000000000000",
          treatmentId: tid,
          isActive: true,
        }));

      const existingPackageIds = wellnessProgram?.packages.map(p => ({
        id: p.wellnessProgramPackageId,
        packageId: p.packageId,
        isActive: (data.selectedPackages || []).includes(p.packageId),
      })) || [];

      const newPackageIds = (data.selectedPackages || [])
        .filter(pid => !existingPackageIds.some(ep => ep.packageId === pid))
        .map(pid => ({
          id: "00000000-0000-0000-0000-000000000000",
          packageId: pid,
          isActive: true,
        }));

      updateWellnessProgram({
        wellnessProgramCode: data.wellnessProgramCode,
        wellnessProgramName: data.wellnessProgramName,
        description: data.description,
        duration: data.duration,
        durationUnit: data.durationUnit,
        price: data.price,
        notes: data.notes,
        treatmentIds: [...existingTreatmentIds, ...newTreatmentIds],
        packageIds: [...existingPackageIds, ...newPackageIds],
      });
    }
    else {
      createWellnessProgram({
        wellnessProgramCode: data.wellnessProgramCode,
        wellnessProgramName: data.wellnessProgramName,
        description: data.description,
        duration: data.duration,
        durationUnit: data.durationUnit,
        price: data.price,
        notes: data.notes,
        treatmentIds: (data.selectedTreatments || []).map(tid => ({ treatmentId: tid })),
        packageIds: (data.selectedPackages || []).map(pid => ({ packageId: pid })),
      });
    }
  });

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Wellness program created successfully");
      form.reset();
      router.push("/masters/treatment-management?tab=wellness-program");
    }
  }, [isCreateSuccess, router, form]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Wellness program updated successfully");
      router.push("/masters/treatment-management?tab=wellness-program");
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
          form.setError(property as keyof WellnessProgramFormValues, {
            type: "server",
            message,
          });
        });
        return;
      }

      if (apiError?.type === "VALIDATION_ERROR") {
        const validationMessage = apiError.detail || apiError.title || "There was a validation issue. Please review your input.";
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
  }, [createError, updateError, form, wellnessProgram]);

  if (wellnessProgramId && isLoadingGetWellnessProgram) {
    return <AddWellnessProgramFormLoader />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.formState.errors.root?.message && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Wellness Program Information</CardTitle>
              <CardDescription>
                Enter the details of the wellness program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wellnessProgramCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Wellness Program Code
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., WP-001"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wellnessProgramName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Wellness Program Name
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Complete Wellness Journey"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
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
                        {...field}
                        placeholder="Detailed description of the wellness program"
                        rows={3}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Package & Treatment Selection</CardTitle>
              <CardDescription>
                Select packages and individual treatments to include in this wellness program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="selectedPackages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Packages (Multi-Select)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={packageOptions}
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? []}
                        placeholder={isLoadingPackages ? "Loading packages..." : "Select packages (optional)"}
                        maxCount={5}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedTreatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Individual Treatments (Multi-Select)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={treatmentOptions}
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? []}
                        placeholder={isLoadingTreatments ? "Loading treatments..." : "Select individual treatments"}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong>
                  {" "}
                  You must select at least one package or one treatment to create a wellness program.
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set the price for the wellness program (manually entered)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          placeholder="e.g., 25000"
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
                    <FormLabel>Notes / Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional notes or remarks about this wellness program"
                        rows={3}
                        value={field.value ?? ""}
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
              onClick={() => router.push("/masters/treatment-management?tab=wellness-program")}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
              {wellnessProgramId
                ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Update Wellness Program
                    </>
                  )
                : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Wellness Program
                    </>
                  )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
