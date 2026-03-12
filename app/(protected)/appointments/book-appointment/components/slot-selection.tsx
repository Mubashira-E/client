"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { addDays, format, isBefore, isSameDay } from "date-fns";
import { Check, Clock, Stethoscope } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DatePickerButton } from "@/components/ui/date-picker-Button";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import emptyImage from "@/public/assets/svg/common/empty.svg";
import { useGetAvailableSlotsQuery } from "@/queries/visit/useGetAvailableSlotsQuery";
import { SlotsSkeletonLoader } from "./slot-skeleton-loader";

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "Morning" | "Afternoon" | "Evening";

type DynamicDate = {
  id: string;
  label: string;
  date: Date;
};

type EnrichedSlot = {
  timeSlot: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  _idx: number;
};

// ─── Module-scoped helpers (not exported — satisfies react-refresh rule) ──────

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

function getPeriod(timeSlot: string): Period {
  const start = timeSlot.split(" - ")[0].trim();
  let hour = 0;
  const m12 = start.match(/^(\d{1,2}):\d{2}\s*(AM|PM)$/i);
  if (m12) {
    hour = Number.parseInt(m12[1], 10);
    const p = m12[2].toUpperCase();
    if (p === "PM" && hour !== 12)
      hour += 12;
    if (p === "AM" && hour === 12)
      hour = 0;
  }
  else {
    const m24 = start.match(/^(\d{1,2}):\d{2}$/);
    if (m24)
      hour = Number.parseInt(m24[1], 10);
  }
  if (hour < 12)
    return "Morning";
  if (hour < 17)
    return "Afternoon";
  return "Evening";
}

// ─── Props ────────────────────────────────────────────────────────────────────

type SlotSelectionProps = {
  clinicianId: string;
  treatmentId: string;
  roomId: string;
  onSelectSlot: (slot: string) => void;
  selectedSlot: string | null;
  preselectedDate?: Date;
  hideCalendar?: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SlotSelection({
  clinicianId,
  treatmentId,
  roomId,
  onSelectSlot,
  preselectedDate,
  hideCalendar = false,
}: SlotSelectionProps) {
  const { setValue, getValues } = useFormContext<CreateAppointmentSchema>();

  const dynamicDates = useMemo<DynamicDate[]>(() => buildDates(), []);

  // Derive highlighted date-pill from prop — no useEffect setter needed
  const derivedDateId = useMemo<string>(() => {
    if (!preselectedDate)
      return "today";
    const today = new Date();
    if (isSameDay(preselectedDate, today))
      return "today";
    if (isSameDay(preselectedDate, addDays(today, 1)))
      return "tomorrow";
    const found = dynamicDates.find((d: DynamicDate) =>
      isSameDay(d.date, preselectedDate),
    );
    return found?.id ?? "";
  }, [preselectedDate, dynamicDates]);

  const [selectedDateId, setSelectedDateId] = useState<string>(derivedDateId);
  const [showCalendarIcon, setShowCalendarIcon]
    = useState<boolean>(!preselectedDate);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    () => preselectedDate ?? new Date(),
  );

  // Prop takes priority over local state — avoids useEffect-based setState
  const effectiveDateId = preselectedDate ? derivedDateId : selectedDateId;
  const effectiveCalendar = preselectedDate ?? calendarDate;
  const effectiveShowIcon = preselectedDate ? false : showCalendarIcon;

  const selectedDateObj = useMemo<Date>(
    () =>
      effectiveCalendar
      ?? dynamicDates.find((d: DynamicDate) => d.id === effectiveDateId)?.date
      ?? new Date(),
    [effectiveCalendar, effectiveDateId, dynamicDates],
  );

  // ─── API call ─────────────────────────────────────────────────────────────
  const formattedApiDate = format(selectedDateObj, "yyyy-MM-dd");
  const { data: slotsData, isLoading } = useGetAvailableSlotsQuery({
    clinicianId: clinicianId || undefined,
    date: formattedApiDate,
    treatmentId: treatmentId || undefined,
    roomId: roomId || undefined,
  });

  const groupedSlots = useMemo<Record<Period, EnrichedSlot[]>>(() => {
    const empty: Record<Period, EnrichedSlot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };
    if (!slotsData?.length)
      return empty;
    slotsData.forEach((slot, idx) => {
      const period = getPeriod(slot.timeSlot);
      empty[period].push({ ...slot, _idx: idx + 1 });
    });
    return empty;
  }, [slotsData]);

  const hasSlots = Boolean(slotsData?.length);
  const formattedDisplayDate = format(selectedDateObj, "d EEEE MMMM");

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function isSlotInPast(slotTime: string): boolean {
    try {
      const startLabel = slotTime.split(" - ")[0].trim();
      let hour = 0;
      let min = 0;
      const m12 = startLabel.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m12) {
        hour = Number.parseInt(m12[1], 10);
        min = Number.parseInt(m12[2], 10);
        const p = m12[3].toUpperCase();
        if (p === "PM" && hour !== 12)
          hour += 12;
        if (p === "AM" && hour === 12)
          hour = 0;
      }
      else {
        const m24 = startLabel.match(/^(\d{1,2}):(\d{2})$/);
        if (!m24)
          return false;
        hour = Number.parseInt(m24[1], 10);
        min = Number.parseInt(m24[2], 10);
      }
      const slotDT = new Date(selectedDateObj);
      slotDT.setHours(hour, min, 0, 0);
      const now = new Date();
      if (isSameDay(selectedDateObj, now)) {
        return slotDT < new Date(now.getTime() + 10 * 60_000);
      }
      return isBefore(selectedDateObj, now);
    }
    catch {
      return false;
    }
  }

  function resetSlots() {
    onSelectSlot("");
    setValue(
      "bookedInfo",
      { slotDate: "", rotaName: "", slots: [] },
      { shouldValidate: true },
    );
  }

  function handleSelectSlot(slot: EnrichedSlot) {
    if (isSlotInPast(slot.timeSlot))
      return;
    onSelectSlot(slot.timeSlot);
    const currentSlots = getValues("bookedInfo.slots") ?? [];
    const newSlot = {
      slotId: slot._idx,
      slotTime: slot.timeSlot,
      bookedStatus: "Booked",
      startTime: slot.startTime,
      endTime: slot.endTime,
    };
    const alreadySelected = currentSlots.some(s => s.slotId === slot._idx);
    const updated = alreadySelected
      ? currentSlots.filter(s => s.slotId !== slot._idx)
      : [...currentSlots, newSlot];
    setValue(
      "bookedInfo",
      {
        slotDate: format(selectedDateObj, "dd/MM/yyyy"),
        rotaName: "Available Slots",
        slots: updated,
      },
      { shouldValidate: true, shouldDirty: true },
    );
  }

  function handleDateChange(date: Date | undefined) {
    if (!date)
      return;
    setCalendarDate(date);
    setShowCalendarIcon(false);
    const found = dynamicDates.find((d: DynamicDate) =>
      isSameDay(d.date, date),
    );
    setSelectedDateId(found?.id ?? "");
    resetSlots();
  }

  function handleDateButtonClick(dateId: string) {
    setSelectedDateId(dateId);
    setCalendarDate(
      dynamicDates.find((d: DynamicDate) => d.id === dateId)?.date,
    );
    setShowCalendarIcon(true);
    resetSlots();
  }

  const periodLabels: Period[] = ["Morning", "Afternoon", "Evening"];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col space-y-4">
      <FormLabel className="mt-2">
        <Stethoscope className="w-4 h-4 text-primary inline mr-1" />
        {"Slots Available For "}
        <span className="text-primary font-semibold">
          {formattedDisplayDate}
        </span>
        <span className="text-red-500">*</span>
      </FormLabel>

      {!hideCalendar && (
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="flex items-center flex-col xl:flex-row gap-2 w-full xl:w-auto">
            <DatePickerButton
              date={effectiveCalendar}
              fromDate={new Date()}
              onDateChange={handleDateChange}
            >
              <button
                type="button"
                className="p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer w-30"
              >
                {effectiveCalendar && !effectiveShowIcon
                  ? (
                      <div className="text-white bg-primary rounded-md px-4 py-1 h-8 font-medium text-sm w-full flex items-center justify-center">
                        {format(effectiveCalendar, "dd EEE MMM")}
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
                    variant={effectiveDateId === d.id ? "default" : "outline"}
                    className={cn(
                      "h-8 rounded-md whitespace-nowrap",
                      effectiveDateId === d.id
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
      )}

      {isLoading
        ? (
            <SlotsSkeletonLoader />
          )
        : !hasSlots
            ? (
                <section className="flex flex-col items-center justify-center py-6">
                  <Image src={emptyImage} alt="No slots" width={280} height={280} />
                  <p className="text-gray-500 text-sm mt-2">
                    {!clinicianId
                      ? "Select a clinician to see available slots"
                      : !treatmentId
                          ? "Select a treatment to see available slots"
                          : "No slots available for the selected date"}
                  </p>
                </section>
              )
            : (
                <div className="grid grid-cols-1 gap-6 mt-2">
                  {periodLabels.map((period) => {
                    const slots = groupedSlots[period];
                    if (!slots?.length)
                      return null;
                    return (
                      <div key={period} className="border rounded-md p-4 bg-gray-50">
                        <h4 className="font-semibold text-base mb-3 flex items-center gap-2 text-primary">
                          <Clock className="w-4 h-4" />
                          {period}
                        </h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                          {slots.map((slot: EnrichedSlot) => {
                            const isPast = isSlotInPast(slot.timeSlot);
                            const isBooked = !slot.isAvailable;
                            const isDisabled = isBooked || isPast;
                            const isSelected = (
                              getValues("bookedInfo.slots") ?? []
                            ).some(s => s.slotId === slot._idx);
                            return (
                              <Button
                                type="button"
                                variant="outline"
                                key={slot.timeSlot}
                                disabled={isDisabled}
                                title={
                                  isPast
                                    ? "Time has passed"
                                    : isBooked
                                      ? "Already Booked"
                                      : "Select this slot"
                                }
                                className={cn(
                                  "flex gap-2 h-16 justify-start items-center relative border transition-colors",
                                  isSelected
                                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                                    : !isDisabled
                                        ? "bg-green-50 border-green-600 text-green-900 hover:bg-green-100"
                                        : "bg-red-50 border-red-300 text-red-400 opacity-60 cursor-not-allowed",
                                )}
                                onClick={() => {
                                  if (!isDisabled)
                                    handleSelectSlot(slot);
                                }}
                              >
                                <Clock className="size-6 shrink-0" strokeWidth={1} />
                                <div className="flex flex-col text-left">
                                  <p className="text-xs">
                                    {"From "}
                                    {slot.timeSlot.split(" - ")[0]}
                                  </p>
                                  <p className="text-xs">
                                    {"To "}
                                    {slot.timeSlot.split(" - ")[1] ?? ""}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="absolute top-1 right-1">
                                    <Check
                                      size={16}
                                      className="text-white bg-green-600 rounded-full border border-green-600"
                                    />
                                  </span>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
    </div>
  );
}
