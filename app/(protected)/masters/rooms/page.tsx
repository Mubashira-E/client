import type { Metadata } from "next";
import { RoomTabs } from "./room-tabs";

export const metadata: Metadata = {
  title: "E-Medical Record / Rooms",
  description: "E-Medical Record / Rooms",
};

export default function RoomsPage() {
  return <RoomTabs />;
}
