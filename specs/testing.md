# Testing Specification

## Overview

This application uses Vitest with Testing Library for component testing. Tests focus on behavior over implementation details.

## Testing Stack

- **Vitest** - Fast test runner with Jest-compatible API
- **@testing-library/react** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers

## Test Setup

**Config:** `vitest.config.mts`

```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

**Setup:** `vitest.setup.ts`

```typescript
import "@testing-library/jest-dom/vitest";
```

## Testing Patterns

### Pattern 1: Utility Function Testing

```typescript
// lib/date-time-utils.test.ts
import { describe, expect, it } from "vitest";
import { convertTo24Hour, formatDateForApi } from "./date-time-utils";

describe("convertTo24Hour", () => {
  it("should return \"13:00\", when input is \"1:00 PM\"", () => {
    expect(convertTo24Hour("1:00 PM")).toBe("13:00");
  });

  it("should return an empty string, when input is invalid", () => {
    expect(convertTo24Hour("25:00 PM")).toBe("");
    expect(convertTo24Hour("random string")).toBe("");
  });
});
```

### Pattern 2: Component Testing (Simple)

```typescript
// components/ui/button.test.tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
```

### Pattern 3: Component with React Query

```typescript
// app/login/components/login-form.test.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock mutation hook
const mockLoginMutateAsync = vi.fn();
vi.mock("@/queries/auth/useLoginMutationQuery", () => ({
  useLoginMutationQuery: vi.fn(() => ({
    mutateAsync: mockLoginMutateAsync,
    isPending: false,
  })),
}));

// Custom render with providers
function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields", () => {
    renderWithClient(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithClient(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(mockLoginMutateAsync).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    renderWithClient(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(mockLoginMutateAsync).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    });
  });
});
```

### Pattern 4: Component with Zustand Store

```typescript
// Mock Zustand store
const mockSetJwtToken = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    jwtToken: null,
    setJwtToken: mockSetJwtToken,
  })),
}));

describe("Component with Auth", () => {
  it("updates auth store on login", async () => {
    // Test implementation
    expect(mockSetJwtToken).toHaveBeenCalledWith("new-token");
  });
});
```

### Pattern 5: Component with Environment Variables

```typescript
describe("TermsModal", () => {
  const originalEnv = process.env.NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER;
    }
  });

  describe("when feature flag is true", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER = "true";
    });

    it("renders checkbox", () => {
      render(<TermsModal open={true} />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });
});
```

## Testing Library Patterns

### Query Methods

```typescript
// Preferred queries (by priority)
screen.getByRole("button", { name: /submit/i })      // Best - semantic
screen.getByLabelText(/email/i)                      // Forms
screen.getByText(/welcome/i)                         // Text content
screen.getByPlaceholderText(/enter email/i)          // Inputs
screen.getByTestId("submit-button")                  // Last resort

// Async queries (for elements that appear later)
await screen.findByText(/success/i)                  // Wait for element
await screen.findByRole("alert")                     // Wait for alert

// Query variants
screen.queryByText(/not here/i)                      // Returns null if not found
screen.getAllByRole("listitem")                      // Multiple elements
```

### User Interactions

```typescript
import { userEvent } from "@testing-library/user-event";

// Clicking
await userEvent.click(screen.getByRole("button"));

// Typing
await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");

// Selecting
await userEvent.selectOptions(screen.getByRole("combobox"), "option1");

// Checkbox
await userEvent.click(screen.getByRole("checkbox"));
```

### Assertions

```typescript
// Presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Content
expect(element).toHaveTextContent("text");
expect(element).toHaveValue("value");

// State
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(checkbox).toBeChecked();

// Classes
expect(element).toHaveClass("active");

// Attributes
expect(element).toHaveAttribute("href", "/path");

// Mock calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(expectedArg);
expect(mockFn).toHaveBeenCalledTimes(2);
```

## Anti-Patterns

### ❌ Testing Implementation Details

```typescript
// ❌ DON'T - Test internal state
expect(component.state.count).toBe(1);

// ✅ DO - Test behavior
expect(screen.getByText("Count: 1")).toBeInTheDocument();
```

### ❌ Not Using userEvent

```typescript
// ❌ DON'T
fireEvent.click(button);

// ✅ DO - More realistic
await userEvent.click(button);
```

### ❌ Querying by Class Names

```typescript
// ❌ DON'T
screen.getByClassName("submit-button");

// ✅ DO
screen.getByRole("button", { name: /submit/i });
```

## Test Organization

```typescript
describe("ComponentName", () => {
  // Setup before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    // Restore mocks, env vars, etc.
  });

  // Group related tests
  describe("when user is authenticated", () => {
    it("shows user profile", () => {
      // Test
    });
  });

  describe("when user is not authenticated", () => {
    it("shows login button", () => {
      // Test
    });
  });
});
```

## Running Tests

```bash
# Run all tests
bun run test

# Run with UI
bun run test:ui

# Run with coverage
bun run test:coverage

# Watch mode
bun run test --watch
```

## Related Specifications

- [Component Patterns](./component-patterns.md) - Components to test
- [API Integration](./api-integration.md) - Mocking queries and mutations

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Utility Testing | `lib/date-time-utils.test.ts` |
| Component Testing | `lib/components/delete-confirmation-modal.test.tsx` |
| With React Query | `app/login/components/login-form.test.tsx` |
| With Env Vars | `components/ui/terms-modal.test.tsx` |
