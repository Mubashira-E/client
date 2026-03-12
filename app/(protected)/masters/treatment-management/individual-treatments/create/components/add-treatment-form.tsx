"use client";

import type { AxiosError } from "axios";
import type { TreatmentRequest } from "@/queries/masters/treatments/useCreateTreatmentMutationQuery";
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
import { useGetAllInventoryItemsQuery } from "@/queries/masters/inventory/useGetAllInventoryItemsQuery";
import { useGetDurationUnitsQuery } from "@/queries/masters/package-plans/useGetDurationUnitsQuery";
import { createTreatmentSchema, useCreateTreatmentMutation } from "@/queries/masters/treatments/useCreateTreatmentMutationQuery";
import { useGetTreatmentByIdQuery } from "@/queries/masters/treatments/useGetTreatmentByIdQuery";
import { useUpdateTreatmentMutation } from "@/queries/masters/treatments/useUpdateTreatmentMutationQuery";
import { AddTreatmentFormLoader } from "./add-treatment-form-loader";

type AddTreatmentFormProps = {
  treatmentId?: string;
};

export function AddTreatmentForm({ treatmentId }: AddTreatmentFormProps) {
  const router = useRouter();

  const form = useForm<TreatmentRequest>({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      price: undefined,
      duration: undefined,
      durationUnit: undefined,
      notes: "",
      inventoryItems: [],
    },
  });

  const { items: inventoryItems, isPending: isLoadingInventory } = useGetAllInventoryItemsQuery();

  const { data: durationUnits, isPending: isLoadingDurationUnits } = useGetDurationUnitsQuery();

  const inventoryOptions = useMemo(
    () =>
      (inventoryItems ?? []).map(item => ({
        value: item.id,
        label: item.itemName,
      })),
    [inventoryItems],
  );

  const durationUnitOptions = useMemo(
    () =>
      (durationUnits ?? []).map((item: { id: number; name: string }) => ({
        value: item.id,
        label: item.name,
      })),
    [durationUnits],
  );

  const { data: treatmentData, isPending: isLoadingTreatment } = useGetTreatmentByIdQuery(treatmentId as string);

  useEffect(() => {
    if (treatmentData) {
      form.setValue("code", treatmentData.treatmentCode || "");
      form.setValue("name", treatmentData.treatmentName || "");
      form.setValue("description", treatmentData.description || "");
      form.setValue("price", treatmentData.price);
      form.setValue("duration", treatmentData.duration || 0);

      // Map durationUnit string to number
      const durationUnit = durationUnitOptions.find(
        (opt: { value: number; label: string }) => opt.label === treatmentData.durationUnit,
      );
      if (durationUnit) {
        form.setValue("durationUnit", durationUnit.value);
      }

      form.setValue("notes", treatmentData.notes || "");

      // Set inventory items
      if (treatmentData.inventoryItems) {
        form.setValue(
          "inventoryItems",
          treatmentData.inventoryItems.map((item: { inventoryItemId: string; quantity: number }) => ({
            inventoryItemId: item.inventoryItemId,
            quantity: item.quantity || 1,
          })),
        );
      }
    }
  }, [treatmentData, form, durationUnitOptions]);

  const { mutate: createTreatment, isPending: isCreating } = useCreateTreatmentMutation({
    onSuccess: () => {
      toast.success("Treatment created successfully", {
        description: `Treatment "${form.getValues("name")}" has been created.`,
      });
      form.reset();
      router.push("/masters/treatment-management?tab=treatment-plan");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Unknown error occurred";
      toast.error("Error creating treatment", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updateTreatment, isPending: isUpdating } = useUpdateTreatmentMutation(treatmentId as string, {
    onSuccess: () => {
      toast.success("Treatment updated successfully", {
        description: `Treatment "${form.getValues("name")}" has been updated.`,
      });
      form.reset();
      router.push("/masters/treatment-management?tab=treatment-plan");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Unknown error occurred";
      toast.error("Error updating treatment", {
        description: errorMessage,
      });
    },
  });

  async function onSubmit(data: TreatmentRequest) {
    if (treatmentId) {
      // Transform data for update API
      const updateData = {
        code: data.code,
        name: data.name,
        description: data.description || "",
        price: data.price,
        duration: data.duration,
        durationUnit: data.durationUnit,
        notes: data.notes || "",
        inventoryItems: (data.inventoryItems || []).map((item: any) => ({
          id: item.id, // inventoryTreatmentId if exists
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity || 1,
          isActive: true,
        })),
      };
      updateTreatment(updateData);
    }
    else {
      createTreatment(data);
    }
  }

  if (treatmentId && isLoadingTreatment) {
    return <AddTreatmentFormLoader />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Treatment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Information</CardTitle>
              <CardDescription>
                Enter the details of the treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Treatment Code
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., TRT-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Treatment Name
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Panchakarma Detox"
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
                        placeholder="Detailed description of the treatment"
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

              <FormField
                control={form.control}
                name="inventoryItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Items</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <MultiSelect
                          options={inventoryOptions}
                          onValueChange={(selectedIds) => {
                            const current = field.value ?? [];
                            const updated = selectedIds.map((id) => {
                              const existing = current.find((item: any) => item.inventoryItemId === id);
                              return existing ?? { inventoryItemId: id, quantity: 1 };
                            });
                            field.onChange(updated);
                          }}
                          defaultValue={(field.value ?? []).map((item: any) => item.inventoryItemId)}
                          placeholder={isLoadingInventory ? "Loading inventory items..." : "Select inventory items"}
                          className="h-10"
                        />

                        {(field.value ?? []).length > 0 && (
                          <div className="space-y-3">
                            {(field.value ?? []).map((item: any) => {
                              const inventoryDetails = inventoryOptions.find(opt => opt.value === item.inventoryItemId);
                              return (
                                <div key={item.inventoryItemId} className="flex items-center gap-4 border rounded-lg p-3">
                                  <div className="flex-1">
                                    <p className="font-medium">{inventoryDetails?.label ?? "Selected Item"}</p>
                                  </div>
                                  <div className="w-32">
                                    <Input
                                      type="number"
                                      min={1}
                                      value={item.quantity ?? 1}
                                      onChange={(e) => {
                                        const raw = Number.parseInt(e.target.value, 10);
                                        const sanitized = Number.isNaN(raw) || raw <= 0 ? 1 : raw;
                                        const next = (field.value ?? []).map(entry =>
                                          entry.inventoryItemId === item.inventoryItemId
                                            ? { ...entry, quantity: sanitized }
                                            : entry,
                                        );
                                        field.onChange(next);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes / Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or remarks about this treatment"
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

          <Separator />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/masters/treatment-management?tab=treatment-plan")}
              disabled={isCreating || isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating && "Creating..."}
              {isUpdating && "Updating..."}
              {!isCreating && !isUpdating && (treatmentId ? "Update Treatment" : "Create Treatment")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
