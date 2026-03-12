# Error Handling Specification

## Overview

Error handling in this application covers API errors, validation errors, and UI error states. Errors are displayed through toast notifications, inline messages, and dedicated error components.

## Error Display Methods

### 1. Toast Notifications (Sonner)

**Use for:** Transient feedback for mutations (create, update, delete)

```typescript
import { toast } from "sonner";

// Success
toast.success("Treatment created successfully", {
  description: `Treatment "${treatmentName}" has been created.`,
});

// Error
toast.error("Error creating treatment", {
  description: error.response?.data?.message || "An error occurred",
});

// Warning
toast.warning("Please review your input", {
  description: "Some fields may need attention",
});

// Info
toast.info("Processing your request", {
  description: "This may take a few moments",
});
```

### 2. Form Validation Errors

**Use for:** Real-time field validation

```typescript
<FormField
  control={form.control}
  name="treatmentName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Treatment Name</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage /> {/* Shows validation error automatically */}
    </FormItem>
  )}
/>
```

**Zod schema with error messages:**

```typescript
const schema = z.object({
  treatmentName: z.string().min(2, {
    message: "Treatment name must be at least 2 characters",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),
});
```

### 3. Form-Level Errors (Alert)

**Use for:** Authentication errors, overall form errors

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

{loginError && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{loginError}</AlertDescription>
  </Alert>
)}
```

### 4. Query Error States

**Use for:** Data fetching errors

```typescript
const { data, isLoading, error, isError } = useGetAllPatientsQuery({});

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || "Failed to load patients"}
      </AlertDescription>
    </Alert>
  );
}
```

### 5. Table Error State

**Use for:** Errors in data tables

```typescript
export function PatientTableError({ error }: { error: Error }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <AlertCircle className="size-8" />
          <p>Error loading patients: {error.message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
```

## Error Handling Patterns

### Pattern 1: Mutation Error Handling

```typescript
const { mutateAsync, isPending } = useCreateTreatmentMutationQuery({
  onSuccess: () => {
    toast.success("Treatment created successfully");
    router.push("/masters/treatments");
  },
  onError: (error: AxiosError) => {
    toast.error("Error creating treatment", {
      description: error.response?.data?.message || "Unknown error occurred",
    });
  },
});

async function onSubmit(data: TreatmentRequest) {
  try {
    await mutateAsync(data);
  } catch (error) {
    // Error already handled in onError callback
    console.error("Error:", error);
  }
}
```

### Pattern 2: Query Error Handling

```typescript
const { patients, isLoading, error } = useGetAllPatientsQuery({ pageNumber: 1 });

if (error) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load patients. Please try again.
        </AlertDescription>
      </Alert>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  );
}
```

### Pattern 3: Axios Error Typing

```typescript
import type { AxiosError } from "axios";

type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

try {
  await mutateAsync(data);
} catch (error) {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    toast.error(apiError.message || "An error occurred");
  }
}
```

### Pattern 4: Validation Error Display

```typescript
// Backend returns field-specific errors
type ValidationError = {
  errors: {
    treatmentName: ["Name is required", "Name must be unique"];
    price: ["Price must be positive"];
  };
};

// Set errors on form
const { mutateAsync } = useCreateTreatmentMutationQuery({
  onError: (error: AxiosError<ValidationError>) => {
    const errors = error.response?.data?.errors;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field as any, {
          message: messages.join(", "),
        });
      });
    }
  },
});
```

### Pattern 5: Delete Confirmation with Error Handling

```typescript
const [deleteId, setDeleteId] = useState<string | null>(null);
const { mutateAsync, isPending } = useDeleteTreatmentMutationQuery();

async function handleConfirmDelete() {
  if (!deleteId) return;

  try {
    await mutateAsync(deleteId);
    toast.success("Treatment deleted successfully");
    setDeleteId(null);
  } catch (error) {
    toast.error("Failed to delete treatment", {
      description: error instanceof AxiosError
        ? error.response?.data?.message
        : "Unknown error occurred",
    });
  }
}

return (
  <DeleteConfirmationModal
    open={!!deleteId}
    onOpenChange={(open) => !open && setDeleteId(null)}
    onConfirm={handleConfirmDelete}
    isLoading={isPending}
  />
);
```

## Error Message Patterns

### User-Friendly Messages

```typescript
// ❌ DON'T - Technical error
"Network Error: ECONNREFUSED"

// ✅ DO - User-friendly
"Unable to connect to server. Please check your internet connection."

// ❌ DON'T - No context
"Error"

// ✅ DO - Specific context
"Failed to create treatment. Please try again."
```

### Descriptive Toast Notifications

```typescript
// ✅ Good - Has description
toast.error("Error creating treatment", {
  description: "Treatment code already exists. Please use a unique code.",
});

// ✅ Good - Success with details
toast.success("Treatment created successfully", {
  description: `Treatment "${data.treatmentName}" has been created.`,
});
```

## Decision Trees

### Where to Show Errors?

```
Is it a field-level validation error?
│
├─ Yes → <FormMessage /> below field
│
└─ No → Is it a mutation error (create, update, delete)?
    │
    ├─ Yes → Toast notification
    │
    └─ No → Is it a data fetching error?
        │
        ├─ Yes → Alert component or table error state
        │
        └─ No → Form-level Alert above form
```

### Toast vs Alert?

```
Is the error transient (mutation result)?
│
├─ Yes → Use toast.error()
│   └─ Auto-dismisses, doesn't block UI
│
└─ No → Is it persistent (query error, auth error)?
    └─ Yes → Use <Alert variant="destructive" />
        └─ Stays visible, blocks workflow
```

## Anti-Patterns

### ❌ Silent Failures

```typescript
// ❌ DON'T - No error feedback
try {
  await mutateAsync(data);
} catch (error) {
  console.error(error); // User sees nothing!
}
```

```typescript
// ✅ DO - Show error to user
try {
  await mutateAsync(data);
} catch (error) {
  toast.error("Failed to create treatment");
}
```

### ❌ Generic Error Messages

```typescript
// ❌ DON'T
toast.error("Error");
```

```typescript
// ✅ DO
toast.error("Failed to create treatment", {
  description: error.response?.data?.message || "Please try again",
});
```

### ❌ Not Handling Errors in Mutations

```typescript
// ❌ DON'T
const { mutateAsync } = useCreateTreatmentMutationQuery();
// No onError, no try/catch
```

```typescript
// ✅ DO
const { mutateAsync } = useCreateTreatmentMutationQuery({
  onError: (error) => {
    toast.error("Failed to create treatment");
  },
});
```

### ❌ Showing Stack Traces to Users

```typescript
// ❌ DON'T
toast.error(error.stack);
```

```typescript
// ✅ DO
toast.error("An error occurred", {
  description: error.message || "Please try again",
});
console.error(error); // Log full error for debugging
```

## Sonner Configuration

**Location:** `components/ui/sonner.tsx`

```typescript
<Toaster
  theme={theme as ToasterProps["theme"]}
  className="toaster group"
  toastOptions={{
    classNames: {
      toast: "group toast group-[.toaster]:bg-background...",
      description: "group-[.toast]:text-muted-foreground",
      actionButton: "group-[.toast]:bg-primary...",
      cancelButton: "group-[.toast]:bg-muted...",
    },
  }}
/>
```

## Related Specifications

- [API Integration](./api-integration.md) - Mutation error handling
- [Form Patterns](./form-patterns.md) - Validation errors

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Mutation Errors | `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx` |
| Form Validation | React Hook Form with Zod schemas |
| Query Errors | Table error states throughout app |
| Toast Usage | Form submission handlers |
