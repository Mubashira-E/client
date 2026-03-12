"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

type InvalidRowsDialogProps = {
  open: boolean;
  rowsWithoutValues: number;
  validRowsCount?: number;
  missingColumns?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function InvalidRowsDialog({ open, rowsWithoutValues, validRowsCount, missingColumns, onConfirm, onCancel }: InvalidRowsDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid Rows Detected</AlertDialogTitle>
          <AlertDialogDescription className="break-all max-h-60 overflow-y-auto">
            {rowsWithoutValues}
            {" "}
            row(s) don't have values for mandatory columns
            {missingColumns ? ` (${missingColumns})` : ""}
            .
            {validRowsCount !== undefined && (
              <>
                {" "}
                Do you want to proceed with the remaining
                {" "}
                {validRowsCount}
                {" "}
                rows?
              </>
            )}
            {validRowsCount === undefined && " Do you want to proceed with the upload?"}
            {" "}
            The rows with missing values will be skipped during processing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>No, Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes, Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
