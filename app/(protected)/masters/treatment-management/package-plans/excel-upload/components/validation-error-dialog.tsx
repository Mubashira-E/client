"use client";

import Lottie from "lottie-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import errorAnimation from "@/public/assets/lotties/info.json";

type ValidationErrorDialogProps = {
  open: boolean;
  title?: string;
  detail?: string;
  onClose: () => void;
};

export function ValidationErrorDialog({ open, title, detail, onClose }: ValidationErrorDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Validation Error"}</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center gap-4 text-base text-foreground">
            <Lottie
              loop={true}
              autoplay
              className="size-12 shrink-0"
              animationData={errorAnimation}
            />
            <span>
              {detail
                || "The uploaded file failed validation. Please review the template and try again."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
