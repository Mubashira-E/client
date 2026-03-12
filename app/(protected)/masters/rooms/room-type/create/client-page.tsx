"use client";

import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRoomTypeSchema, useCreateRoomTypeMutation } from "@/queries/masters/rooms/room-type/useCreateRoomTypeMutation";

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createRoomTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
    },
  });

  const { mutateAsync, isPending } = useCreateRoomTypeMutation();

  const onSubmit = async (values: any) => {
    form.clearErrors();

    try {
      await mutateAsync(values);
      toast.success("Room type created successfully");
      router.push("/masters/rooms?tab=room-type");
    }
    catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiErrorResponse;

        if (apiError?.type === "VALIDATION_ERROR") {
          if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
            apiError.errors.forEach(({ property, message }) => {
              if (property && message) {
                form.setError(property as "typeName" | "description", {
                  type: "server",
                  message,
                });
              }
            });
          }
          else {
            const validationMessage = apiError?.detail || apiError?.title || "There was a validation issue. Please review your input.";
            form.setError("root", {
              type: "server",
              message: validationMessage,
            });
          }
          return;
        }

        // For non-validation errors, show toast
        const errorMessage = apiError?.detail || apiError?.message || "Failed to create room type";
        toast.error(errorMessage);
      }
      else {
        // For non-Axios errors, show toast
        toast.error("Failed to create room type");
      }
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/rooms?tab=room-type"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Room Types</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <h2 className="text-lg font-semibold">Add Room Type</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
            {form.formState.errors.root?.message && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type Name
                    {" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type name" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>Save</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </section>
    </section>
  );
}
