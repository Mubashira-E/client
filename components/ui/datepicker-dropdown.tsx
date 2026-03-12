"use client";

import { addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date;
  to: Date;
};

export type DateRangeOption = {
  label: string;
  value: string;
  getRange: () => DateRange;
};

export type DateRangePickerProps = {
  range?: DateRange;
  onSelectedRangeChanged?: (range: DateRange) => void;
  className?: string;
};

export function DateRangePicker({ range, onSelectedRangeChanged, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(range);
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [customDateRange, setCustomDateRange] = useState<DateRange>(() => ({
    from: new Date(),
    to: new Date(),
  }));

  const dateRangeOptions: DateRangeOption[] = useMemo(() => [
    {
      label: "Today",
      value: "today",
      getRange: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: "Tomorrow",
      value: "tomorrow",
      getRange: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { from: tomorrow, to: tomorrow };
      },
    },
    {
      label: "This Week",
      value: "this-week",
      getRange: () => {
        const today = new Date();
        return {
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        };
      },
    },
    {
      label: "Next Week",
      value: "next-week",
      getRange: () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return {
          from: startOfWeek(nextWeek, { weekStartsOn: 1 }),
          to: endOfWeek(nextWeek, { weekStartsOn: 1 }),
        };
      },
    },
    {
      label: "This Month",
      value: "this-month",
      getRange: () => {
        const today = new Date();
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
      },
    },
    {
      label: "Next Month",
      value: "next-month",
      getRange: () => {
        const nextMonth = addMonths(new Date(), 1);
        return {
          from: startOfMonth(nextMonth),
          to: endOfMonth(nextMonth),
        };
      },
    },
    {
      label: "Next 3 Months",
      value: "next-3-months",
      getRange: () => {
        const today = new Date();
        const threeMonthsLater = addMonths(today, 3);
        return {
          from: today,
          to: threeMonthsLater,
        };
      },
    },
    {
      label: "Custom",
      value: "custom",
      getRange: () => customDateRange,
    },
  ], [customDateRange]);

  // Initialize with the first option if no range is provided
  useEffect(() => {
    if (!selectedRange && !range) {
      const defaultOption = dateRangeOptions[0];
      const defaultRange = defaultOption.getRange();

      const timeoutId1 = setTimeout(() => {
        setSelectedRange(defaultRange);
        setSelectedOption(defaultOption.value);
      }, 0);
      onSelectedRangeChanged?.(defaultRange);

      return () => clearTimeout(timeoutId1);
    }
    else if (range && !selectedRange) {
      const timeoutId2 = setTimeout(() => {
        setSelectedRange(range);
        const matchingOption = dateRangeOptions.find((option) => {
          if (option.value === "custom")
            return false;
          const optionRange = option.getRange();
          return (
            optionRange.from.toDateString() === range.from.toDateString()
            && optionRange.to.toDateString() === range.to.toDateString()
          );
        });
        setSelectedOption(matchingOption?.value || "custom");
        if (!matchingOption) {
          setCustomDateRange(range);
        }
      }, 0);

      return () => clearTimeout(timeoutId2);
    }
  }, [range, selectedRange, onSelectedRangeChanged, dateRangeOptions]);

  const formatDateRange = (range?: DateRange) => {
    if (!range)
      return "Select date range";

    if (range.from.toDateString() === range.to.toDateString()) {
      return format(range.from, "PPP");
    }

    return `${format(range.from, "PP")} - ${format(range.to, "PP")}`;
  };

  const handleSelectOption = (value: string) => {
    const option = dateRangeOptions.find(opt => opt.value === value);
    if (!option)
      return;

    if (value === "custom") {
      setCustomDialogOpen(true);
    }
    else {
      const newRange = option.getRange();
      setSelectedRange(newRange);
      onSelectedRangeChanged?.(newRange);
    }

    setSelectedOption(value);
    setOpen(false);
  };

  const handleCustomRangeSelect = () => {
    if (customDateRange.from && customDateRange.to) {
      setSelectedRange(customDateRange);
      onSelectedRangeChanged?.(customDateRange);
      setCustomDialogOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 opacity-50" />
              <span className="truncate">
                {selectedOption
                  ? dateRangeOptions.find(option => option.value === selectedOption)?.label
                  : "Select range"}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                (
                {formatDateRange(selectedRange)}
                )
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search date range..." />
            <CommandList>
              <CommandEmpty>No date range found.</CommandEmpty>
              <CommandGroup>
                {dateRangeOptions.map(option => (
                  <CommandItem key={option.value} value={option.value} onSelect={handleSelectOption}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedOption === option.value ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="!max-w-[600px] !w-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Custom Date Range</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 justify-start items-start">
                <div className="font-medium text-center mx-auto">From</div>
                <Calendar
                  mode="single"
                  selected={customDateRange.from}
                  onSelect={date => date && setCustomDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                />
              </div>
              <div className="flex flex-col gap-2 justify-start items-start">
                <div className="font-medium text-center mx-auto">To</div>
                <Calendar
                  mode="single"
                  selected={customDateRange.to}
                  onSelect={date => date && setCustomDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                  disabled={date => date < customDateRange.from}
                />
              </div>
            </div>
            <Button onClick={handleCustomRangeSelect}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
