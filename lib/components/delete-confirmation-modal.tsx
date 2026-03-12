import { useCallback } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/AlertDialog";

  type DeleteConfirmationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    cancelText?: string;
    confirmText?: string;
  };

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  itemName,
  cancelText = "Cancel",
  confirmText = "Delete",
}: DeleteConfirmationDialogProps) {
  const handleOpenChange = useCallback((open: boolean) => {
    onOpenChange(open);

    if (!open) {
      setTimeout(() => (document.body.style.pointerEvents = ""), 500);
    }
  }, [onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName
              ? `This will permanently delete "${itemName}". ${description}`
              : description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
