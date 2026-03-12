"use client";

import type { z } from "zod";
import type { CreateRoomRequest } from "@/queries/masters/rooms/useCreateRoomMutation";
import type { ApiErrorResponse } from "@/types/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllRoomTypeQuery } from "@/queries/masters/rooms/room-type/useGetAllRoomTypeQuery";
import { createRoomSchema, useCreateRoomMutation } from "@/queries/masters/rooms/useCreateRoomMutation";
import { useGetRoomByIdQuery } from "@/queries/masters/rooms/useGetRoomByIdQuery";
import { useUpdateRoomMutation } from "@/queries/masters/rooms/useUpdateRoomMutation";

export type RoomFormValues = z.input<typeof createRoomSchema>;

export type RoomFormRef = {
  setError: (field: keyof RoomFormValues, error: { type: string; message: string }) => void;
  setRootError: (error: { type: string; message: string }) => void;
  clearErrors: () => void;
  formState: ReturnType<typeof useForm<RoomFormValues>>["formState"];
};

type RoomFormProps = {
  initialValues?: Partial<RoomFormValues>;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: CreateRoomRequest) => Promise<void> | void;
  ref?: React.RefObject<RoomFormRef | null>;
};

export function RoomForm({ initialValues, submitLabel, submitting, onSubmit, ref }: RoomFormProps) {
  const { roomTypes, isLoading: isRoomTypesLoading } = useGetAllRoomTypeQuery({
    pageSize: 999,
    Status: 1,
  });

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: initialValues?.roomName ?? "",
      roomTypeId: initialValues?.roomTypeId ?? "",
      roomLocation: initialValues?.roomLocation ?? "",
      remarks: initialValues?.remarks ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      roomName: initialValues?.roomName ?? "",
      roomTypeId: initialValues?.roomTypeId ?? "",
      roomLocation: initialValues?.roomLocation ?? "",
      remarks: initialValues?.remarks ?? "",
    });
  }, [form, initialValues?.roomLocation, initialValues?.remarks, initialValues?.roomName, initialValues?.roomTypeId]);

  // Set ref synchronously so it's available immediately
  useLayoutEffect(() => {
    if (ref) {
      ref.current = {
        setError: (field: keyof RoomFormValues, error: { type: string; message: string }) => {
          form.setError(field, error);
        },
        setRootError: (error: { type: string; message: string }) => {
          form.setError("root", error);
        },
        clearErrors: () => {
          form.clearErrors();
        },
        formState: form.formState,
      };
    }
  }, [ref, form, form.formState]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const parsedValues = createRoomSchema.parse(values);
    await onSubmit(parsedValues);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.formState.errors.root?.message && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Room Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Room Name
                    {" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room name or identifier" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value} disabled={isRoomTypesLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isRoomTypesLoading ? "Loading..." : "Select room type"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.length === 0 && (
                          <SelectItem value="__no_room_types__" disabled>
                            No active room types found
                          </SelectItem>
                        )}
                        {roomTypes.map(rt => (
                          <SelectItem key={rt.roomTypeId} value={rt.roomTypeId}>
                            {rt.typeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-8 top-0 h-9 w-9 p-0"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Location</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="Floor, wing, or specific location" {...field} />
                    </FormControl>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-9 w-9 p-0"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks / Notes</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Textarea
                      placeholder="Additional information regarding the room (e.g., special equipment, maintenance)"
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => field.onChange("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={submitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

type AddRoomFormProps = { roomId?: string };

export function AddRoomForm({ roomId }: AddRoomFormProps) {
  const router = useRouter();
  const createRoom = useCreateRoomMutation();
  const { data: room, isLoading } = useGetRoomByIdQuery(roomId as string);
  const updateRoom = useUpdateRoomMutation(roomId as string);
  const formRef = React.useRef<RoomFormRef>(null);

  const handleSubmit = async (values: CreateRoomRequest) => {
    // Clear previous errors
    formRef.current?.clearErrors();

    try {
      if (roomId) {
        await updateRoom.mutateAsync(values);
        toast.success("Room updated successfully");
        router.push("/masters/rooms");
      }
      else {
        await createRoom.mutateAsync(values);
        toast.success("Room created successfully");
        router.push("/masters/rooms");
      }
    }
    catch (err) {
      // Handle error directly
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiErrorResponse;

        // Check if it's a validation error
        if (apiError?.type === "VALIDATION_ERROR") {
          // Handle field-specific errors if they exist
          if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
            apiError.errors.forEach(({ property, message }) => {
              if (property && message && formRef.current) {
                formRef.current.setError(property as keyof RoomFormValues, {
                  type: "server",
                  message,
                });
              }
            });
          }
          else if (formRef.current) {
            // Set root error for validation errors
            const validationMessage = apiError?.detail || apiError?.title || "There was a validation issue. Please review your input.";
            formRef.current.setRootError({
              type: "server",
              message: validationMessage,
            });
          }
          return;
        }

        // For non-validation errors, show toast
        const errorMessage = apiError?.detail || apiError?.message || (roomId ? "Failed to update room" : "Failed to create room");
        toast.error(errorMessage);
      }
      else {
        // For non-Axios errors, show toast
        toast.error(roomId ? "Failed to update room" : "Failed to create room");
      }
    }
  };

  useEffect(() => {
    const error = createRoom.error || updateRoom.error;
    if (!error) {
      return;
    }

    // Wait for ref to be initialized
    if (!formRef.current) {
      return;
    }

    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorResponse;

      // Check if it's a validation error
      if (apiError?.type === "VALIDATION_ERROR") {
        // Handle field-specific errors if they exist
        if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
          apiError.errors.forEach(({ property, message }) => {
            if (property && message) {
              formRef.current?.setError(property as keyof RoomFormValues, {
                type: "server",
                message,
              });
            }
          });
          return;
        }

        // Set root error for validation errors
        const validationMessage = apiError?.detail || apiError?.title || "There was a validation issue. Please review your input.";
        formRef.current?.setRootError({
          type: "server",
          message: validationMessage,
        });
        return;
      }

      // For non-validation errors, show toast
      const errorMessage = apiError?.detail || apiError?.message || (roomId ? "Failed to update room" : "Failed to create room");
      toast.error(errorMessage);
      return;
    }

    // For non-Axios errors, show toast
    toast.error(roomId ? "Failed to update room" : "Failed to create room");
  }, [createRoom.error, updateRoom.error, roomId, formRef]);

  return (
    <>
      {roomId && isLoading && (
        <div className="text-center py-8">Loading room details...</div>
      )}
      {(!roomId || !isLoading) && (
        <RoomForm
          ref={formRef}
          initialValues={
            roomId && room
              ? {
                  roomName: room.roomName,
                  roomTypeId: room.roomTypeId || "",
                  roomLocation: room.roomLocation,
                  remarks: room.remarks || "",
                }
              : undefined
          }
          submitLabel={roomId ? "Update Room" : "Create Room"}
          submitting={roomId ? updateRoom.isPending : createRoom.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
