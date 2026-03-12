import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type LogoProps = ComponentPropsWithoutRef<"svg"> & {
  variant?: "default" | "full";
};

export function CuraEMRLogo({ className, variant: _variant = "default", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", className)}
      {...props}
    >
      <path d="M9 12h6" />
      <path d="M12 9v6" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
