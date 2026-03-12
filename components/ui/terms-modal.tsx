"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";

type TermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const isDisplayDontShowAgain = process.env.NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER === "true";
  const { setHasAcceptedTerms, setHasJustLoggedIn } = useAuthStore();

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleAccept = () => {
    if (dontShowAgain) {
      setHasAcceptedTerms(true);
    }
    setHasJustLoggedIn(false);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setHasJustLoggedIn(false);
    }
    onOpenChange(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="!max-w-[900px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            Information
          </AlertDialogTitle>
          <AlertDialogDescription className="text-justify text-sm leading-relaxed text-gray-700">
            This computer system belongs to EMR Demo Instance and should only be used for approved purposes. By utilizing this system, all users consent to be aware of and abide by the EMR Demo Instance. Acceptable application of high-level information security policy. The EMR Demo Instance may impose administrative disciplinary action, civil charges, criminal fines, and/or other punishments for unauthorized or inappropriate use of this system. To proceed further, you acknowledge that you have read these terms and conditions of use and that you agree to them by using this system further.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className={cn("sm:flex sm:flex-row sm:items-center", isDisplayDontShowAgain ? "sm:justify-between" : "sm:justify-end")}>
          {
            isDisplayDontShowAgain && (
              <div className="flex items-center space-x-2 py-4">
                <Checkbox
                  id="dont-show-again"
                  checked={dontShowAgain}
                  onCheckedChange={checked => setDontShowAgain(checked === true)}
                />
                <label
                  htmlFor="dont-show-again"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Don't show this again
                </label>
              </div>
            )
          }
          <AlertDialogAction onClick={handleAccept} className="bg-primary hover:bg-primary/90">
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
