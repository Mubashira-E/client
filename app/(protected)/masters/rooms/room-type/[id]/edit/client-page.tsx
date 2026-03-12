"use client";

import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetRoomTypeByIdQuery } from "@/queries/masters/rooms/room-type/useGetRoomTypeByIdQuery";
import { updateRoomTypeSchema, useUpdateRoomTypeMutation } from "@/queries/masters/rooms/room-type/useUpdateRoomTypeMutation";

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const roomTypeId = search.get("roomTypeId") || "";

  const { data, isPending: loading } = useGetRoomTypeByIdQuery(roomTypeId);
  const { mutateAsync, isPending } = useUpdateRoomTypeMutation(roomTypeId);

  const form = useForm({
    resolver: zodResolver(updateRoomTypeSchema),
    defaultValues: { typeName: "", description: "" },
  });

  useEffect(() => {
    if (data) {
      form.reset({ typeName: data.typeName || "", description: data.description || "" });
    }
  }, [data, form]);

  const onSubmit = async (values: any) => {
    form.clearErrors();

    try {
      await mutateAsync(values);
      toast.success("Room type updated successfully");
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

        const errorMessage = apiError?.detail || apiError?.message || "Failed to update room type";
        toast.error(errorMessage);
      }
      else {
        toast.error("Failed to update room type");
      }
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">Edit Room Type</h2>
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
                  <Input placeholder="Enter type name" {...field} disabled={loading} />
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
                  <Textarea placeholder="Enter description" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending || loading}>Save</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
