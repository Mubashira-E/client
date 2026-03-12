/* eslint-disable react-hooks-extra/no-unnecessary-use-prefix */
import type { Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LogInForm } from "@/app/login/components/login-form"; // Adjust path as needed
import { useLoginMutationQuery } from "@/queries/auth/useLoginMutationQuery";

type MockedAuthStoreState = {
  jwtToken: string | null;
  setJwtToken: (jwtToken: string | null) => void;
};

const { mockSetJwtToken, mockGetState } = vi.hoisted(() => {
  const setJwtTokenFn = vi.fn();
  const getStateFn = vi.fn((): MockedAuthStoreState => ({
    jwtToken: null,
    setJwtToken: setJwtTokenFn,
  }));
  return { mockSetJwtToken: setJwtTokenFn, mockGetState: getStateFn };
});

const mockRouterPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/login",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: mockGetState,
  },
}));

const mockLoginMutateAsync = vi.fn();
vi.mock("@/queries/auth/useLoginMutationQuery", () => ({
  useLoginMutationQuery: vi.fn(() => ({
    mutateAsync: mockLoginMutateAsync,
    isPending: false,
    isSuccess: false,
    error: null,
  })),
}));

vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("logInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetState.mockImplementation((): MockedAuthStoreState => ({
      jwtToken: null,
      setJwtToken: mockSetJwtToken,
    }));
    (useLoginMutationQuery as Mock).mockReturnValue({
      mutateAsync: mockLoginMutateAsync,
      isPending: false,
      isSuccess: false,
      error: null,
    });
  });

  afterEach(() => {
  });

  it("should render the login form correctly", () => {
    renderWithClient(<LogInForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should display validation errors for empty fields on submit", async () => {
    renderWithClient(<LogInForm />);
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(mockLoginMutateAsync).not.toHaveBeenCalled();
  });

  it("should allow typing into username and password fields", async () => {
    renderWithClient(<LogInForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should toggle password visibility", async () => {
    renderWithClient(<LogInForm />);
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    await userEvent.type(passwordInput, "secret");

    expect(passwordInput.type).toBe("password");
    const toggleButton = passwordInput.parentElement?.querySelector("div[class*='cursor-pointer']");
    expect(toggleButton).toBeInTheDocument();

    if (toggleButton) {
      await userEvent.click(toggleButton);
      expect(passwordInput.type).toBe("text");
      await userEvent.click(toggleButton);
      expect(passwordInput.type).toBe("password");
    }
  });

  it("should redirect to home if JWT token already exists on mount", () => {
    mockGetState.mockReturnValue({
      jwtToken: "existing-fake-token",
      setJwtToken: mockSetJwtToken,
    });

    renderWithClient(<LogInForm />);

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });

  it("should disable login button while submitting", async () => {
    (useLoginMutationQuery as Mock).mockReturnValue({
      mutateAsync: mockLoginMutateAsync,
      isPending: true,
      isSuccess: false,
      error: null,
    });

    renderWithClient(<LogInForm />);
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeDisabled();
    expect(loginButton.querySelector("svg[class*='animate-spin']")).toBeInTheDocument();
  });
});
