"use client";

import { addDays, format, isSameDay } from "date-fns";
import { Calendar, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DatePickerButton } from "@/components/ui/date-picker-Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { RoomSlotSelection } from "./room-slot-selection";
import { SelectableSessionsList } from "./selectable-sessions-list";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomAllocationFlowProps = {
  patient: any;
};

type DynamicDate = {
  id: string;
  label: string;
  date: Date;
};

// ─── Module-scoped helper ─────────────────────────────────────────────────────

function buildDates(): DynamicDate[] {
  const today = new Date();
  const dates: DynamicDate[] = [
    { id: "today", label: "Today", date: today },
    { id: "tomorrow", label: "Tomorrow", date: addDays(today, 1) },
  ];
  for (let i = 2; i < 9; i++) {
    const d = addDays(today, i);
    dates.push({
      id: `day-${i}`,
      label: `${format(d, "d")} ${format(d, "EEE")} ${format(d, "MMM")}`,
      date: d,
    });
  }
  return dates;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RoomAllocationFlow({
  patient: _patient,
}: RoomAllocationFlowProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateId, setSelectedDateId] = useState("today");
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    () => new Date(),
  );
  const [showCalendarIcon, setShowCalendarIcon] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState<
    { roomName: string; time: string }[]
  >([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const therapists = [
    { id: "1", name: "Dr. Sarah Johnson" },
    { id: "2", name: "Dr. Michael Chen" },
    { id: "3", name: "Dr. Priya Sharma" },
  ];

  const dynamicDates = useMemo<DynamicDate[]>(() => buildDates(), []);

  function handleSessionSelect(sessionId: number) {
    setSelectedSessionId(sessionId);
    setSelectedDate(new Date());
    setCalendarDate(new Date());
    setSelectedDateId("today");
    setShowCalendarIcon(true);
    setSelectedSlots([]);
  }

  function handleDateChange(date: Date | undefined) {
    if (!date)
      return;
    setCalendarDate(date);
    setSelectedDate(date);
    setShowCalendarIcon(false);
    setSelectedSlots([]);
    const found = dynamicDates.find((d: DynamicDate) =>
      isSameDay(d.date, date),
    );
    setSelectedDateId(found?.id ?? "");
  }

  function handleDateButtonClick(dateId: string) {
    setSelectedDateId(dateId);
    const d = dynamicDates.find((x: DynamicDate) => x.id === dateId)?.date;
    if (!d)
      return;
    setCalendarDate(d);
    setSelectedDate(d);
    setShowCalendarIcon(true);
    setSelectedSlots([]);
  }

  function handleSlotSelect(roomName: string, slotTime: string) {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        s => s.roomName === roomName && s.time === slotTime,
      );
      return exists
        ? prev.filter(s => !(s.roomName === roomName && s.time === slotTime))
        : [...prev, { roomName, time: slotTime }];
    });
  }

  function handleSave() {
    if (!selectedSessionId) {
      toast.error("Please select a session");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedSlots.length) {
      toast.error("Please select at least one room slot");
      return;
    }
    if (!selectedTherapist) {
      toast.error("Please select a therapist");
      return;
    }
    toast.success("Room allocation saved successfully!");
  }

  return (
    <div className="space-y-8">
      {/* 1. Sessions */}
      <SelectableSessionsList
        total={10}
        completed={6}
        selectedSessionId={selectedSessionId}
        onSessionSelect={handleSessionSelect}
      />

      {/* 2. Date */}
      {selectedSessionId && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex flex-col space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Select Date
            </Label>

            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
              <div className="flex items-center xl:flex-row flex-col gap-2 w-full xl:w-auto">
                <DatePickerButton
                  date={calendarDate}
                  fromDate={new Date()}
                  onDateChange={handleDateChange}
                >
                  <button
                    type="button"
                    className="p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer w-30"
                  >
                    {calendarDate && !showCalendarIcon
                      ? (
                          <div className="text-white bg-primary rounded-md px-4 py-1 h-8 font-medium text-sm w-full flex items-center justify-center">
                            {format(calendarDate, "dd EEE MMM")}
                          </div>
                        )
                      : (
                          <div className="text-primary rounded-md px-4 py-1 h-8 font-medium text-sm w-full flex items-center justify-center border border-primary">
                            Custom Date
                          </div>
                        )}
                  </button>
                </DatePickerButton>

                <div className="w-full xl:w-auto overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {dynamicDates.map((d: DynamicDate) => (
                      <Button
                        type="button"
                        key={d.id}
                        variant={
                          selectedDateId === d.id ? "default" : "outline"
                        }
                        className={cn(
                          "h-8 rounded-md whitespace-nowrap",
                          selectedDateId === d.id
                            ? "bg-primary hover:bg-primary/80"
                            : "text-gray-600",
                        )}
                        onClick={() => handleDateButtonClick(d.id)}
                      >
                        {d.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Room & Slot */}
      {selectedSessionId && selectedDate && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <RoomSlotSelection
            selectedDate={selectedDate}
            onSlotSelect={handleSlotSelect}
            selectedSlots={selectedSlots}
          />
        </div>
      )}

      {/* 4. Therapist & Remarks */}
      {selectedSessionId && selectedDate && selectedSlots.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Select Therapist</Label>
              <Select
                value={selectedTherapist}
                onValueChange={setSelectedTherapist}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a therapist" />
                </SelectTrigger>
                <SelectContent>
                  {therapists.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input
                placeholder="Enter any remarks…"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t mt-4">
            <Button
              onClick={handleSave}
              className="w-full md:w-auto min-w-37.5"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Allocation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
