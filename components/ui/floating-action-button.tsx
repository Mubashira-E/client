import { Plus } from "lucide-react";

type FloatingActionButtonProps = {
  onClick: () => void;
};

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="floating-action-button"
      className="fixed right-8 bottom-8 z-50 flex size-12 items-center justify-center rounded-full bg-primary-700 shadow-lg transition-colors cursor-pointer"
    >
      <Plus className="size-8 text-primary" strokeWidth={1.5} />
    </button>
  );
}
