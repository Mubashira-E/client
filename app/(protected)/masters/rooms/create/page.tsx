import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddRoomForm } from "./components/add-room-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Room",
  description: "E-Medical Record / Create Room",
};

export default function RoomCreatePage() {
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
          title="Create Room"
          description="Create a new treatment room with all necessary details and configurations"
        />
        <AddRoomForm />
      </section>
    </section>
  );
}
