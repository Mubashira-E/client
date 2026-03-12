/* eslint-disable react-refresh/only-export-components */
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-primary/40 bg-background px-4 py-1 text-foreground",
        inProgress: "border-transparent bg-[oklch(var(--status-in-progress))] text-[oklch(0.25_0.02_85)] hover:bg-[oklch(var(--status-in-progress))]/80",
        done: "border-transparent bg-[oklch(var(--status-done))] text-white hover:bg-[oklch(var(--status-done))]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = {} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
