"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { addDays, format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DatePickerButton } from "@/components/ui/date-picker-Button";
import { cn } from "@/lib/utils";

type DateSelectorProps = {
  onDateSelected: (date: Date) => void;
};

export function DateSelector({ onDateSelected }: DateSelectorProps) {
  const { setValue } = useFormContext<CreateAppointmentSchema>();
  const [selectedDateId, setSelectedDateId] = useState("today");
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(() => new Date());
  const [showCalendarIcon, setShowCalendarIcon] = useState(true);

  const dynamicDates = useMemo(() => {
    const today = new Date();
    const dates = [
      { id: "today", label: "Today", date: today },
      { id: "tomorrow", label: "Tomorrow", date: addDays(today, 1) },
    ];

    for (let i = 2; i < 5; i++) {
      const date = addDays(today, i);
      const dayNum = format(date, "d");
      const dayName = format(date, "EEE");
      const monthShort = format(date, "MMM");
      dates.push({
        id: `day-${i}`,
        label: `${dayNum} ${dayName} ${monthShort}`,
        date,
      });
    }

    return dates;
  }, []);

  const selectedDateObj = useMemo(() => {
    return calendarDate || dynamicDates.find(d => d.id === selectedDateId)?.date || new Date();
  }, [selectedDateId, dynamicDates, calendarDate]);

  const formattedDisplayDate = format(selectedDateObj, "d EEEE MMMM");

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCalendarDate(date);
      setShowCalendarIcon(false);

      setValue("bookedInfo", {
        slotDate: format(date, "dd/MM/yyyy"),
        rotaName: "",
        slots: [],
      });

      const matchingDateId = dynamicDates.find(d =>
        d.date && date && isSameDay(d.date, date),
      )?.id;

      if (matchingDateId) {
        setSelectedDateId(matchingDateId);
      }
      else {
        setSelectedDateId("");
      }

      onDateSelected(date);
    }
  };

  const handleDateButtonClick = (dateId: string) => {
    setSelectedDateId(dateId);
    const selectedDate = dynamicDates.find(d => d.id === dateId)?.date;
    if (selectedDate) {
      setCalendarDate(selectedDate);

      setValue("bookedInfo", {
        slotDate: format(selectedDate, "dd/MM/yyyy"),
        rotaName: "",
        slots: [],
      });

      setShowCalendarIcon(true);
      onDateSelected(selectedDate);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div className="flex items-center">
            <h3 className="text-sm font-semibold">
              Select a date for appointment:
              {" "}
              <span className="text-red-500">{formattedDisplayDate}</span>
            </h3>
          </div>

          <div className="flex items-center xl:flex-row flex-col gap-2 w-full xl:w-auto">
            <div className="w-full xl:w-auto">
              <DatePickerButton
                date={calendarDate}
                onDateChange={handleDateChange}
              >
                <button type="button" className="p-0 border-0 bg-transparent flex items-center justify-center w-full xl:w-auto cursor-pointer">
                  {calendarDate && !showCalendarIcon
                    ? (
                        <div className="text-white bg-blue-800 rounded-md px-4 py-1 h-8 font-medium text-sm w-full xl:w-auto flex items-center justify-center">
                          {format(calendarDate, "dd EEE MMM")}
                        </div>
                      )
                    : (
                        <div className="text-blue-700 rounded-md px-4 py-1 h-8 font-medium text-sm w-full xl:w-auto flex items-center justify-center">
                          <CalendarIcon className="size-5 text-blue-700 mr-2" />
                          Pick a date
                        </div>
                      )}
                </button>
              </DatePickerButton>
            </div>

            <div className="w-full xl:w-auto overflow-x-auto">
              <div className="flex gap-2 lg:flex-row flex-row min-w-max">
                {dynamicDates.map(date => (
                  <Button
                    type="button"
                    key={date.id}
                    variant={selectedDateId === date.id ? "default" : "outline"}
                    className={cn(
                      "h-8 rounded-md whitespace-nowrap",
                      selectedDateId === date.id ? "bg-blue-800 hover:bg-blue-900" : "text-gray-600",
                    )}
                    onClick={() => handleDateButtonClick(date.id)}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
