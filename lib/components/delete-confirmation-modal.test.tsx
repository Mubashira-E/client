import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal"; // Adjust path as needed

vi.mock("@/components/ui/AlertDialog", async () => {
  const actual = await vi.importActual("@/components/ui/AlertDialog");
  return {
    ...actual,
    AlertDialog: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      children: React.ReactNode;
    }) => {
      return open
        ? (
            <div data-testid="mock-alert-dialog" data-open={open}>
              <button
                type="button"
                data-testid="mock-alert-dialog-close-button"
                onClick={() => onOpenChange(false)}
              >
                Close Mock Dialog
              </button>
              {children}
            </div>
          )
        : null;
    },
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-alert-dialog-content">{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-alert-dialog-header">{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2 data-testid="mock-alert-dialog-title">{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p data-testid="mock-alert-dialog-description">{children}</p>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-alert-dialog-footer">{children}</div>
    ),
    AlertDialogCancel: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button data-testid="mock-alert-dialog-cancel" type="button" onClick={onClick}>
        {children}
      </button>
    ),
    AlertDialogAction: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button data-testid="mock-alert-dialog-action" type="button" onClick={onClick}>
        {children}
      </button>
    ),
  };
});

describe("deleteConfirmationModal", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.pointerEvents = "";
  });

  it("should not render when open is false", () => {
    render(
      <DeleteConfirmationModal
        open={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );
    expect(screen.queryByTestId("mock-alert-dialog")).toBeNull();
  });

  it("should render with default title and description when open is true", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );
    expect(screen.getByTestId("mock-alert-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("mock-alert-dialog-title")).toHaveTextContent(
      "Are you sure?",
    );
    expect(
      screen.getByTestId("mock-alert-dialog-description"),
    ).toHaveTextContent("This action cannot be undone.");
    expect(screen.getByTestId("mock-alert-dialog-cancel")).toHaveTextContent(
      "Cancel",
    );
    expect(screen.getByTestId("mock-alert-dialog-action")).toHaveTextContent(
      "Delete",
    );
  });

  it("should render with custom title and description", () => {
    const customTitle = "Custom Delete Title";
    const customDescription = "Custom delete description.";
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        title={customTitle}
        description={customDescription}
      />,
    );
    expect(screen.getByTestId("mock-alert-dialog-title")).toHaveTextContent(
      customTitle,
    );
    expect(
      screen.getByTestId("mock-alert-dialog-description"),
    ).toHaveTextContent(customDescription);
  });

  it("should include itemName in the description when provided", () => {
    const itemName = "My Important File";
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        itemName={itemName}
      />,
    );
    expect(
      screen.getByTestId("mock-alert-dialog-description"),
    ).toHaveTextContent(
      `This will permanently delete "${itemName}". This action cannot be undone.`,
    );
  });

  it("should render with custom button texts", () => {
    const cancelText = "Keep it";
    const confirmText = "Yes, remove it";
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        cancelText={cancelText}
        confirmText={confirmText}
      />,
    );
    expect(screen.getByTestId("mock-alert-dialog-cancel")).toHaveTextContent(
      cancelText,
    );
    expect(screen.getByTestId("mock-alert-dialog-action")).toHaveTextContent(
      confirmText,
    );
  });

  it("should call onConfirm when confirm button is clicked", async () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );
    await userEvent.click(screen.getByTestId("mock-alert-dialog-action"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange with false when the mocked dialog close is triggered (e.g., overlay click, escape key)", async () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );
    await userEvent.click(
      screen.getByTestId("mock-alert-dialog-close-button"),
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should reset body pointerEvents after closing if modified (simulated)", async () => {
    document.body.style.pointerEvents = "none";

    const { rerender } = render(
      <DeleteConfirmationModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );

    // Simulate closing the dialog
    rerender(
      <DeleteConfirmationModal
        open={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />,
    );

    await waitFor(() => {
      expect(document.body.style.pointerEvents).toBe("");
    });
  });
});
