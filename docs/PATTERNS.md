# Coding Patterns & Standards

This document outlines the established coding patterns for UI, data fetching, forms, and testing. Adhering to these patterns ensures consistency and maintainability.

## UI & Styling Patterns

### Tailwind CSS & Shadcn UI

We use **Tailwind CSS v4** for styling and **Shadcn UI** for component primitives.

*   **Atomic Classes**: Prefer utility classes over custom CSS.
*   **Component Composition**: Build complex UIs by composing Shadcn primitives (e.g., `<Card>`, `<Button>`, `<Input>`).

### Class Variance Authority (CVA)

We use `class-variance-authority` (cva) to manage component variants. This allows defining base styles and dynamic variants in a type-safe way.

**Example (`components/ui/button.tsx`):**

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center ...", // Base styles
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        destructive: "bg-destructive text-white ...",
      },
      size: {
        default: "h-9 px-6 py-2",
        sm: "h-8 gap-1.5 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### The `cn` Utility

We use a helper function `cn` (typically in `lib/utils.ts`) which combines `clsx` and `tailwind-merge`. This allows conditional class application while properly handling Tailwind class conflicts.

**Usage:**

```tsx
import { cn } from "@/lib/utils";

<div className={cn("bg-red-500", isSelected && "bg-blue-500", className)}>
  {/* If isSelected is true, bg-blue-500 overrides bg-red-500 */}
</div>
```

---

## Data Fetching Patterns (React Query)

We strictly separate data fetching logic from UI components by using custom hooks located in the `queries/` directory.

### Query Hooks (`useQuery`)

Encapsulate `useQuery` calls in custom hooks.

**Structure:**

```tsx
// queries/user/useGetUserByIdQuery.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useGetUserByIdQuery(userId: string) {
  return useQuery({
    queryKey: ["user", userId], // Unique key for caching
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId, // Conditional fetching
  });
}
```

### Mutation Hooks (`useMutation`)

Encapsulate `useMutation` calls for creating/updating/deleting data.

**Structure:**

```tsx
// queries/auth/useLoginMutationQuery.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

export function useLoginMutationQuery() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // Side effects like updating store or invalidating queries
      useAuthStore.getState().setJwtToken(data.token);
    },
  });
}
```

---

## Form Patterns

We use **React Hook Form** for form state management and **Zod** for schema validation.

### Setup

1.  **Define Schema**: Create a Zod schema for the form.
2.  **Initialize Hook**: Use `useForm` with the `zodResolver`.
3.  **Render Fields**: Use Shadcn's `<Form>`, `<FormField>`, `<FormItem>`, `<FormControl>`, etc.

**Example:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## Testing Patterns

We use **Vitest** with **React Testing Library**.

### Testing Components with Providers

Components utilizing `useFormContext` or relying on other providers must be wrapped in the appropriate providers during testing.

**Example:**

```tsx
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { MyComponent } from "./MyComponent";

const Wrapper = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

test("renders correctly", () => {
  render(<MyComponent />, { wrapper: Wrapper });
  expect(screen.getByText("Label")).toBeInTheDocument();
});
```

### Mocking Auth

To test authenticated routes or components:
1.  Inject a valid JSON state into `localStorage` under the key `"auth-storage"`.
2.  Mock the `/api/v1/auth/current-user` endpoint if necessary.
