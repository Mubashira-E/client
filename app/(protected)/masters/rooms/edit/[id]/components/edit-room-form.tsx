"use client";

import type React from "react";
import { AddRoomForm } from "@/app/(protected)/masters/rooms/create/components/add-room-form";

type EditRoomFormProps = {
  roomId: string;
};

export function EditRoomForm({ roomId }: EditRoomFormProps) {
  return <AddRoomForm roomId={roomId} />;
}
