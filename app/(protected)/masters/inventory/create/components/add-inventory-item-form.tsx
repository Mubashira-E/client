"use client";

import type { z } from "zod";
import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllItemCategoryQuery } from "@/queries/masters/inventory/item-category/useGetAllItemCategoryQuery";
import { createInventoryItemSchema, useCreateInventoryItemMutation } from "@/queries/masters/inventory/useCreateInventoryItemMutation";
import { useGetInventoryItemByIdQuery } from "@/queries/masters/inventory/useGetInventoryItemByIdQuery";
import { useGetUnitsQuery } from "@/queries/masters/inventory/useGetUnitsQuery";
import { useUpdateInventoryItemMutation } from "@/queries/masters/inventory/useUpdateInventoryItemMutation";

type InventoryItemFormValues = z.input<typeof createInventoryItemSchema>;

type AddInventoryItemFormProps = {
  inventoryItemId?: string;
};

export function AddInventoryItemForm({ inventoryItemId }: AddInventoryItemFormProps = {}) {
  const router = useRouter();
  const isEditMode = Boolean(inventoryItemId);

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(createInventoryItemSchema),
    defaultValues: {
      itemName: "",
      itemCategoryId: "",
      unit: 1,
      remarks: "",
    },
  });
  const { data: units = [], isPending: isUnitsLoading } = useGetUnitsQuery();
  const { itemCategories: categories = [], isPending: isCategoriesLoading } = useGetAllItemCategoryQuery();
  const { data: inventoryItem, isPending: isLoadingItem, error: inventoryItemError } = useGetInventoryItemByIdQuery(inventoryItemId ?? "");
  const { mutateAsync: createInventoryItem, isPending: isCreating } = useCreateInventoryItemMutation();
  const { mutateAsync: updateInventoryItem, isPending: isUpdating } = useUpdateInventoryItemMutation(inventoryItemId ?? "");

  useEffect(() => {
    if (inventoryItem && !isCategoriesLoading && !isUnitsLoading) {
      form.reset({
        itemName: inventoryItem.itemName ?? "",
        itemCategoryId: inventoryItem.itemCategoryId ?? "",
        unit: inventoryItem.unit ?? 1,
        remarks: inventoryItem.remarks ?? "",
      });
    }
  }, [inventoryItem, form, isCategoriesLoading, isUnitsLoading]);

  const onSubmit = async (values: InventoryItemFormValues) => {
    form.clearErrors();
    try {
      const payload = {
        ...values,
        unit: Number(values.unit),
        remarks: values.remarks?.trim() ?? "",
      };

      if (isEditMode && inventoryItemId) {
        await updateInventoryItem(payload);
      }
      else {
        await createInventoryItem(payload);
      }

      router.push("/masters/inventory");
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse;

        if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
          apiError.errors.forEach(({ property, message }) => {
            if (!property || !message) {
              return;
            }
            form.setError(property as keyof InventoryItemFormValues, {
              type: "server",
              message,
            });
          });
          return;
        }

        if (apiError?.type === "VALIDATION_ERROR" || apiError?.detail) {
          form.setError("root", {
            type: "server",
            message: apiError.detail || apiError.title || "There was a validation issue. Please review your input.",
          });
          return;
        }
      }

      form.setError("root", {
        type: "server",
        message: `Failed to ${isEditMode ? "update" : "create"} inventory item. Please try again.`,
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;
  const actionLabel = isEditMode ? "Update Inventory Item" : "Create Inventory Item";

  if (isEditMode && isLoadingItem) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Loading inventory item...
      </div>
    );
  }

  if (isEditMode && inventoryItemError) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Failed to load inventory item. Please try again.
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root?.message && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Item</CardTitle>
              <CardDescription>Enter item details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Item Name
                        {" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itemCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        key={field.value || "empty"}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={isCategoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "Select category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.length === 0 && !isCategoriesLoading && (
                            <SelectItem value="__no_categories__" disabled>
                              No categories available
                            </SelectItem>
                          )}
                          {categories.map(category => (
                            <SelectItem key={category.itemCategoryId} value={category.itemCategoryId}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      key={field.value || "empty"}
                      onValueChange={value => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      defaultValue={field.value ? String(field.value) : ""}
                      disabled={isUnitsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isUnitsLoading ? "Loading units..." : "Select unit"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map(u => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes" rows={3} {...field} />
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
              onClick={() => router.push("/masters/inventory")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? `${actionLabel}...` : actionLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
