"use client";

import { Check, Clock, DoorOpen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import emptyImage from "@/public/assets/svg/common/empty.svg";

type RoomSlotSelectionProps = {
  selectedDate: Date | null;
  onSlotSelect: (roomName: string, slotTime: string) => void;
  selectedSlots: { roomName: string; time: string }[];
};

export function RoomSlotSelection({
  selectedDate,
  onSlotSelect,
  selectedSlots,
}: RoomSlotSelectionProps) {
  // Static data for rooms and slots
  const roomsData = [
    {
      roomName: "Room 101",
      slots: [
        { time: "09:00 AM - 09:30 AM", status: "Available" },
        { time: "09:30 AM - 10:00 AM", status: "Booked" },
        { time: "10:00 AM - 10:30 AM", status: "Available" },
      ],
    },
    {
      roomName: "Therapy Suite A",
      slots: [
        { time: "09:00 AM - 09:30 AM", status: "Available" },
        { time: "09:30 AM - 10:00 AM", status: "Available" },
        { time: "10:00 AM - 10:30 AM", status: "Available" },
      ],
    },
    {
      roomName: "Ayurveda Hall",
      slots: [
        { time: "09:00 AM - 09:30 AM", status: "Booked" },
        { time: "09:30 AM - 10:00 AM", status: "Booked" },
        { time: "10:00 AM - 10:30 AM", status: "Available" },
      ],
    },
  ];

  if (!selectedDate) {
    return null;
  }

  const handleSelectSlot = (
    roomName: string,
    slotTime: string,
    status: string,
  ) => {
    if (status === "Booked")
      return;

    onSlotSelect(roomName, slotTime);
  };

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-lg flex items-center gap-2 text-primary">
        <DoorOpen className="w-5 h-5" />
        Available Rooms & Slots
      </h4>

      {roomsData.length === 0
        ? (
            <section className="flex flex-col items-center justify-center">
              <Image src={emptyImage} alt="Empty" width={320} height={320} />
              <p className="text-gray-500">No rooms available</p>
            </section>
          )
        : (
            <div className="grid grid-cols-1 gap-6">
              {roomsData.map(room => (
                <div
                  key={room.roomName}
                  className="border rounded-md p-4 bg-gray-50"
                >
                  <h5 className="font-medium text-md mb-3 flex items-center gap-2 text-slate-800">
                    <DoorOpen className="w-4 h-4 text-slate-500" />
                    {room.roomName}
                  </h5>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {room.slots.map((slot) => {
                      const isDisabled = slot.status === "Booked";
                      const isSelected = selectedSlots.some(
                        s => s.roomName === room.roomName && s.time === slot.time,
                      );

                      return (
                        <Button
                          type="button"
                          variant="outline"
                          key={`${room.roomName}-${slot.time}`}
                          disabled={isDisabled}
                          title={isDisabled ? "Already Booked" : "Select this slot"}
                          className={cn(
                            "flex gap-2 h-10 justify-start items-center relative border transition-all duration-200",
                            slot.status === "Available"
                              ? "bg-white border-slate-200 text-slate-700 hover:border-primary hover:text-primary"
                              : "bg-red-50 border-red-200 text-red-900 opacity-60 cursor-not-allowed",
                            isSelected
                            && "bg-white border-primary text-primary shadow-sm hover:bg-primary/5 ring-1 ring-primary",
                          )}
                          onClick={() =>
                            handleSelectSlot(room.roomName, slot.time, slot.status)}
                        >
                          <Clock
                            className={cn(
                              "size-3.5",
                              isSelected ? "text-primary" : "text-slate-400",
                            )}
                          />
                          <span
                            className={cn("text-xs", isSelected && "font-bold")}
                          >
                            {slot.time}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center">
                              <Check
                                size={14}
                                className="text-white bg-primary rounded-full p-0.5"
                              />
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
