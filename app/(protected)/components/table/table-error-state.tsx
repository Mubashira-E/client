"use client";

import Lottie from "lottie-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import errorAnimation from "@/public/assets/lotties/error.json";

type TableErrorStateProps = {
  colSpan: number;
  title?: string;
  description?: string;
  className?: string;
  animationClassName?: string;
  loop?: boolean;
};

export function TableErrorState({
  colSpan,
  title = "Error loading data",
  description = "Please try again later",
  className,
  animationClassName,
  loop = false,
}: TableErrorStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn("h-24 text-center py-8", className)}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Lottie
            loop={loop}
            autoplay
            className={cn("size-64", animationClassName)}
            animationData={errorAnimation}
          />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
