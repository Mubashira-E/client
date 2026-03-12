"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { createItemCategorySchema, useCreateItemCategoryMutation } from "@/queries/masters/inventory/item-category/useCreateItemCategoryMutation";
import { useGetItemCategoryByIdQuery } from "@/queries/masters/inventory/item-category/useGetItemCategoryByIdQuery";
import { useUpdateItemCategoryMutation } from "@/queries/masters/inventory/item-category/useUpdateItemCategoryMutation";
import InventoryCategoryFormLoader from "./add-inventory-category-form-loader";

function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    if (apiError?.detail?.includes("Cannot insert duplicate key row")) {
      const duplicateValue = apiError.detail.match(/The duplicate key value is \((.*?)\)/)?.[1];
      return duplicateValue
        ? `An inventory category with code "${duplicateValue}" already exists. Please use a different code.`
        : "An inventory category with this code already exists. Please use a different code.";
    }
    if (apiError?.message) {
      return apiError.message;
    }
    if (apiError?.detail) {
      return apiError.detail;
    }
    return "Error saving inventory category";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

type ItemCategoryFormValues = {
  categoryCode: string;
  categoryName: string;
  description: string;
};

export function AddInventoryCategoryForm({ itemCategoryId }: { itemCategoryId?: string }) {
  const router = useRouter();

  const form = useForm<ItemCategoryFormValues>({
    resolver: zodResolver(createItemCategorySchema),
    defaultValues: {
      categoryCode: "",
      categoryName: "",
      description: "",
    },
  });

  const { mutate: createItemCategory, isPending: isCreating, error: createError, isSuccess: isCreateSuccess } = useCreateItemCategoryMutation();
  const { mutate: updateItemCategory, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateItemCategoryMutation(itemCategoryId || "");

  const { data: itemCategory, isPending: isLoadingGetCategory } = useGetItemCategoryByIdQuery(itemCategoryId || "");

  useEffect(() => {
    if (itemCategory) {
      form.setValue("categoryCode", itemCategory.categoryCode);
      form.setValue("categoryName", itemCategory.categoryName);
      form.setValue("description", itemCategory.description || "");
    }
  }, [itemCategory, form]);

  async function onSubmit(data: ItemCategoryFormValues) {
    if (itemCategoryId) {
      updateItemCategory({
        categoryCode: data.categoryCode,
        categoryName: data.categoryName,
        description: data.description || "",
      });
    }
    else {
      createItemCategory(data);
    }
  }

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Inventory category created successfully");
      form.reset();
      router.push("/masters/inventory?tab=category");
    }
  }, [isCreateSuccess, router, form]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Inventory category updated successfully");
      router.push("/masters/inventory?tab=category");
    }
  }, [isUpdateSuccess, router]);

  useEffect(() => {
    if (!(createError || updateError)) {
      return;
    }

    const error = createError || updateError;

    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse;
      if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
        apiError.errors.forEach(({ property, message }) => {
          if (!property || !message) {
            return;
          }
          form.setError(property as keyof ItemCategoryFormValues, {
            type: "server",
            message,
          });
        });
        return;
      }

      const validationMessage
        = apiError?.detail
          || apiError?.message
          || "There was a validation issue. Please review your input.";
      form.setError("root", {
        type: "server",
        message: validationMessage,
      });
      return;
    }

    const fallbackMessage = parseApiError(error);
    form.setError("root", {
      type: "server",
      message: fallbackMessage,
    });
  }, [createError, updateError, form]);

  if (itemCategoryId && isLoadingGetCategory) {
    return <InventoryCategoryFormLoader />;
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
          name="categoryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category code"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The unique code for the inventory category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The name of the inventory category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional details about the inventory category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/masters/inventory?tab=category")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {itemCategoryId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
