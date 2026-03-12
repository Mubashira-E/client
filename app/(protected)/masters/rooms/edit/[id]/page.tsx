import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { EditRoomForm } from "./components/edit-room-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Room",
  description: "E-Medical Record / Edit Room",
};

export default async function RoomEditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const roomId = params.id as string;

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/rooms"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Rooms</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Edit Room"
          description="Update room details and configuration"
        />
        <EditRoomForm roomId={roomId} />
      </section>
    </section>
  );
}
