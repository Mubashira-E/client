"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerButtonProps = {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  children: React.ReactNode;
  fromDate?: Date | undefined;
};

export function DatePickerButton({ date, onDateChange, children, fromDate }: DatePickerButtonProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date);
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
    setOpen(false);
  };

  // Sync internal state with prop changes
  React.useEffect(() => {
    /* eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect */
    setInternalDate(date);
  }, [date]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleDateSelect}
          initialFocus
          fromDate={fromDate}
        />
      </PopoverContent>
    </Popover>
  );
}
