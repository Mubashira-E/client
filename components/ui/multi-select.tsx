"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDown, WandSparkles, XCircle, XIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";

const multiSelectVariants = cva(
  "hover:-translate-y-1 m-1 transition delay-150 duration-300 ease-in-out hover:scale-110",
  {
    variants: {
      variant: {
        default: "border-foreground/10 bg-card text-foreground hover:bg-card/80",
        secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type MultiSelectProps = {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  hideSelectAll?: boolean;
  onSearchValueChange?: (value: string) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof multiSelectVariants>;

const EMPTY_ARRAY: string[] = [];

export function MultiSelect({
  ref,
  options,
  onValueChange,
  variant,
  defaultValue = EMPTY_ARRAY,
  placeholder = "Select options",
  animation = 0,
  maxCount = 3,
  className,
  isFetchingNextPage,
  fetchNextPage,
  hideSelectAll = false,
  onSearchValueChange,
  ...props
}: MultiSelectProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { ref: endOfListRef, inView: endOfListInView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (endOfListInView && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [endOfListInView, fetchNextPage, isFetchingNextPage]);

  // Sync internal state with defaultValue prop changes
  useEffect(() => {
    if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
      /* eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect */
      setSelectedValues(defaultValue);
    }
  }, [defaultValue, selectedValues]);

  const toggleOption = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen(prev => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxCount);
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === options.length) {
      handleClear();
    }
    else {
      const allValues = options.map(option => option.value);
      setSelectedValues(allValues);
      onValueChange(allValues);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          onClick={handleTogglePopover}
          className={cn(
            "flex h-auto w-full items-center justify-between rounded-xl border border-primary bg-inherit p-1 hover:bg-inherit",
            className,
          )}
        >
          {selectedValues.length > 0
            ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    {selectedValues.slice(0, maxCount).map((value) => {
                      const option = options.find(o => o.value === value);
                      const IconComponent = option?.icon;
                      return (
                        <Badge
                          key={value}
                          className={cn(isAnimating ? "animate-bounce" : "", multiSelectVariants({ variant, className }))}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {!!IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                          {option?.label}
                          <div
                            className="ml-2 flex items-center justify-center"
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              toggleOption(value);
                            }}
                          >
                            <XCircle className="h-4 w-4 cursor-pointer" />
                          </div>
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant, className }),
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <div
                          className="ml-2 flex items-center justify-center"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            clearExtraOptions();
                          }}
                        >
                          <XCircle className="h-4 w-4 cursor-pointer" />
                        </div>
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className="mx-2 flex items-center justify-center"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleClear();
                      }}
                    >
                      <XIcon className="h-4 cursor-pointer text-muted-foreground" />
                    </div>
                    <Separator orientation="vertical" className="flex h-full min-h-6" />
                    <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                  </div>
                </div>
              )
            : (
                <div className="mx-auto flex w-full items-center justify-between">
                  <span className="mx-3 text-muted-foreground text-sm">{placeholder}</span>
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
        className="w-[var(--radix-popover-trigger-width)] overflow-hidden border-primary-500 p-0 shadow-sm"
      >
        <Command className="overflow-hidden">
          <CommandList
            className="max-h-[200px] overflow-y-auto"
            onWheel={(e) => {
              // Manual scroll handling is needed because the default scroll behavior
              // doesn't work properly within the Command component
              const list = e.currentTarget;
              list.scrollTop += e.deltaY;
              e.preventDefault();
            }}
          >
            <CommandGroup>
              {!hideSelectAll && (
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer px-4 py-2"
                  style={{ pointerEvents: "auto", opacity: 1 }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === options.length
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
              )}
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    className="cursor-pointer px-4 py-2"
                    onSelect={() => toggleOption(option.value)}
                    style={{ pointerEvents: "auto", opacity: 1 }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                    {!!option.icon && <option.icon className="h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {!!isFetchingNextPage && (
                <CommandItem disabled className="px-4 py-2" onSelect={() => {}}>
                  <div className="mr-2 h-4 w-4 animate-pulse rounded-sm bg-muted" />
                  <div className="h-4 w-32 animate-pulse rounded-sm bg-muted" />
                </CommandItem>
              )}
              {!endOfListInView && <div ref={endOfListRef} className="h-px w-full" />}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
      {animation > 0 && selectedValues.length > 0 && (
        <WandSparkles
          className={cn(
            "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
            isAnimating ? "" : "text-muted-foreground",
          )}
          onClick={() => setIsAnimating(!isAnimating)}
        />
      )}
    </Popover>
  );
}

MultiSelect.displayName = "MultiSelect";
