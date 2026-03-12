"use client";

import type { NationalityRequest } from "@/queries/general/nationality/useCreateNationalityMutation";
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
import { createNationalitySchema, useCreateNationalityMutation } from "@/queries/general/nationality/useCreateNationalityMutation";
import { useGetNationalityById } from "@/queries/general/nationality/useGetNationalityByIdQuery";
import { useUpdateNationalityMutation } from "@/queries/general/nationality/useUpdateNationalityMutation";
import NationalityFormLoader from "./add-nationality-form-loader";

// Helper function to parse API errors and provide user-friendly messages
function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    // Handle duplicate nationality code error
    if (apiError?.detail?.includes("Cannot insert duplicate key row in object 'Ayurveda.Nationality' with unique index 'IX_NationalityCode'")) {
      const duplicateValue = apiError.detail.match(/The duplicate key value is \((.*?)\)/)?.[1];
      return duplicateValue
        ? `A nationality with code "${duplicateValue}" already exists. Please use a different code.`
        : "A nationality with this code already exists. Please use a different code.";
    }
    // Handle other API errors
    if (apiError?.message) {
      return apiError.message;
    }
    if (apiError?.detail) {
      return apiError.detail;
    }
    // Fallback to generic error message
    return "Error saving nationality";
  }
  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function AddNationalityForm({ nationalityId }: { nationalityId?: string }) {
  const router = useRouter();

  const form = useForm<NationalityRequest>({
    resolver: zodResolver(createNationalitySchema),
    defaultValues: {
      nationality: "",
      nationalityCode: "",
    },
  });

  const { mutate: createNationality, isPending: isCreating, error: createError, isSuccess: isCreateSuccess } = useCreateNationalityMutation();
  const { mutate: updateNationality, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateNationalityMutation(nationalityId as string);

  const { data: nationality, isPending: isLoadingGetNationality } = useGetNationalityById(nationalityId as string);

  useEffect(() => {
    if (nationality) {
      form.setValue("nationality", nationality.nationalityName);
      form.setValue("nationalityCode", nationality.nationalityCode);
    }
  }, [nationality, form]);

  async function onSubmit(data: NationalityRequest) {
    if (nationalityId) {
      updateNationality({
        nationalityName: data.nationality,
        nationalityCode: data.nationalityCode,
      });
    }
    else {
      createNationality(data);
    }
  }

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Nationality created successfully");
      form.reset();
      router.push("/masters/general?tab=nationality");
    }
  }, [isCreateSuccess, router, form]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Nationality updated successfully");
      router.push("/masters/general?tab=nationality");
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
          form.setError(property as keyof NationalityRequest, {
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
  }, [createError, updateError, form]);

  if (nationalityId && isLoadingGetNationality) {
    return <NationalityFormLoader />;
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
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter nationality name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The name of the nationality (e.g., American, British, Indian)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationalityCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter nationality code"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The code of the nationality.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/masters/general?tab=nationality")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating} isLoading={isCreating || isUpdating}>
            {nationalityId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
