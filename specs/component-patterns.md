# Component Patterns Specification

## Overview

This document defines the component architecture patterns used throughout the application. Components are organized using the Container/Presentational pattern, with feature-based organization and composition-first design.

## Core Component Patterns

### Pattern 1: Container Components

**Purpose:** Manage data fetching, state, and business logic.

**Characteristics:**
- Always use `"use client"` directive
- Handle React Query hooks (useQuery, useMutation)
- Manage local state (filters, pagination)
- Handle user interactions and callbacks
- Compose presentational components

**File Naming:** `*-container.tsx`

**Example:** `app/(protected)/patients/visit-list/components/visit-management-container.tsx:10`

```typescript
"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useGetAllVisitQuery } from "@/queries/visit/useGetAllVisitQuery";
import { VisitManagementHeader } from "./visit-management-header";
import { VisitManagementTable } from "./table/visit-management-table";
import { useVisitManagementStore } from "./stores/useVisitManagementStore";

export function VisitManagementContainer() {
  // URL-based state management
  const [searchFilter, setSearchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault("")
  );
  const [currentPage, setCurrentPage] = useQueryState(
    "currentPage",
    parseAsInteger.withDefault(1)
  );

  // Zustand store for UI preferences
  const { visibleColumns } = useVisitManagementStore();

  // React Query for data fetching
  const { visits, isLoading, totalPages, totalItems } = useGetAllVisitQuery({
    pageNumber: currentPage,
    searchTerms: searchFilter,
    pageSize: 10,
  });

  return (
    <div className="space-y-4">
      <VisitManagementHeader
        totalVisits={totalItems}
        onSearchChange={setSearchFilter}
      />
      <VisitManagementTable
        visits={visits}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        visibleColumns={visibleColumns}
      />
    </div>
  );
}
```

**Key Points:**
- ✅ All data fetching logic in one place
- ✅ URL state for shareable filters (search, pagination)
- ✅ Store-based state for UI preferences (column visibility)
- ✅ Props drilling kept minimal (only necessary data)

### Pattern 2: Presentational Components

**Purpose:** Render UI based on props, no data fetching or complex state.

**Characteristics:**
- Receive all data via props
- Can use `"use client"` for interactivity, but no queries
- Focus on UI rendering and layout
- Reusable and testable in isolation

**File Naming:** `*-header.tsx`, `*-table.tsx`, `*-card.tsx`

**Example:** `app/(protected)/patients/visit-list/components/visit-management-header.tsx:8`

```typescript
"use client";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  totalVisits: number;
  onSearchChange: (value: string) => void;
};

export function VisitManagementHeader({ totalVisits, onSearchChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-medium text-gray-800">Visit Management</h1>
        <p className="text-sm text-gray-600">
          Total visits: {totalVisits.toLocaleString()}
        </p>
      </div>
      <Input
        placeholder="Search visits..."
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
```

**Key Points:**
- ✅ No direct API calls or queries
- ✅ Receives callbacks as props for interactions
- ✅ Focused on rendering only
- ✅ Easy to test with different prop combinations

### Pattern 3: Page Components

**Purpose:** Entry point for routes, minimal logic, delegates to containers.

**Characteristics:**
- Located in `app/(protected)/[feature]/page.tsx`
- Usually simple wrapper around container
- Can add page-level metadata
- Handles loading and error states if needed

**File Naming:** `page.tsx`

**Example:** `app/(protected)/patients/visit-list/page.tsx:1`

```typescript
import { VisitManagementContainer } from "./components/visit-management-container";

export default function VisitListPage() {
  return (
    <div className="space-y-4">
      <VisitManagementContainer />
    </div>
  );
}
```

**With Metadata:**

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Management",
  description: "Manage patient visits and appointments",
};

export default function VisitListPage() {
  return <VisitManagementContainer />;
}
```

### Pattern 4: Form Components

**Purpose:** Handle form logic with React Hook Form + Zod validation.

**Characteristics:**
- Always use `"use client"` directive
- Use `useForm` hook with Zod resolver
- Implement `onSubmit` handler with mutation
- Handle loading and error states
- Dual-purpose (create and edit modes)

**File Naming:** `add-[entity]-form.tsx` or `[entity]-form.tsx`

**Example:** `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx:18`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTreatmentMutationQuery } from "@/queries/masters/treatments/useCreateTreatmentMutationQuery";
import type { TreatmentRequest } from "@/types/treatment";

// Zod schema from mutation query
import { createTreatmentSchema } from "@/queries/masters/treatments/useCreateTreatmentMutationQuery";

type Props = {
  initialData?: TreatmentRequest; // For edit mode
  isEditMode?: boolean;
};

export function AddTreatmentForm({ initialData, isEditMode }: Props) {
  const form = useForm<TreatmentRequest>({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: initialData || {
      treatmentName: "",
      treatmentCode: "",
      price: 0,
    },
  });

  const { mutateAsync, isPending } = useCreateTreatmentMutationQuery();

  async function onSubmit(data: TreatmentRequest) {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Treatment created successfully");
        router.push("/masters/treatments");
      },
      onError: (error) => {
        toast.error("Error creating treatment");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Treatment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="treatmentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Treatment Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., TRT-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* More fields... */}
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditMode ? "Update" : "Create"} Treatment
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

**Key Points:**
- ✅ Zod schema defines validation rules
- ✅ React Hook Form handles form state and validation
- ✅ Mutation hook for API submission
- ✅ Toast notifications for success/error feedback
- ✅ Loading state disables submit button

### Pattern 5: Table Components

**Purpose:** Display data in tabular format with sorting, filtering, pagination.

**Characteristics:**
- Receive data and state as props
- Handle rendering of rows and cells
- Support dynamic column visibility
- Include loading, error, and empty states

**File Naming:** `*-table.tsx`

**Example:** `app/(protected)/masters/treatments/components/table/treatment-management-table.tsx:15`

```typescript
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TreatmentManagementResponse } from "@/types/treatment";

type Props = {
  treatments: TreatmentManagementResponse[];
  isLoading: boolean;
  visibleColumns: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TreatmentManagementTable({
  treatments,
  isLoading,
  visibleColumns,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return <TreatmentManagementTableLoader />;
  }

  if (treatments.length === 0) {
    return <TreatmentManagementTableEmpty />;
  }

  // Render cell content based on column ID
  function renderCell(treatment: TreatmentManagementResponse, columnId: string) {
    switch (columnId) {
      case "treatmentCode":
        return treatment.treatmentCode;
      case "treatmentName":
        return treatment.treatmentName;
      case "price":
        return `$${treatment.price.toFixed(2)}`;
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(treatment.treatmentId)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(treatment.treatmentId)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return null;
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map((columnId) => (
            <TableHead key={columnId}>{columnId}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {treatments.map((treatment) => (
          <TableRow key={treatment.treatmentId}>
            {visibleColumns.map((columnId) => (
              <TableCell key={columnId}>
                {renderCell(treatment, columnId)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**Key Points:**
- ✅ Dynamic column rendering based on visibility state
- ✅ Separate components for loading/error/empty states
- ✅ Action dropdowns for row operations
- ✅ Callbacks for edit/delete actions

### Pattern 6: Shadcn UI Components

**Purpose:** Reusable UI primitives built on Radix UI.

**Characteristics:**
- Located in `components/ui/`
- Use Radix UI primitives with Tailwind styling
- Use CVA (class-variance-authority) for variants
- Use `cn()` utility for class merging

**File Naming:** `[component].tsx` (kebab-case)

**Example:** `components/ui/button.tsx:13`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = {
  asChild?: boolean;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Usage:**

```typescript
<Button variant="default">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" isLoading={isPending}>Delete</Button>
```

## Component Composition Patterns

### Pattern 1: Feature Composition

Compose features from smaller components:

```typescript
// Feature Container
<VisitManagementContainer>
  ├─ <VisitManagementHeader>
  │   ├─ <Input> (search)
  │   └─ <DropdownMenu> (filters)
  ├─ <VisitManagementTable>
  │   ├─ <Table>
  │   │   ├─ <TableHeader>
  │   │   └─ <TableBody>
  │   │       └─ <TableRow> (each row)
  │   │           └─ <DropdownMenu> (actions)
  │   └─ <Pagination>
  └─ <DeleteConfirmationModal>
</VisitManagementContainer>
```

### Pattern 2: Card Composition

Use cards for grouped content:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Patient Information</CardTitle>
    <CardDescription>Basic patient details</CardDescription>
    <CardAction>
      <Button variant="outline">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Form fields or data display */}
  </CardContent>
  <CardFooter>
    <Button type="submit">Save</Button>
  </CardFooter>
</Card>
```

### Pattern 3: Form Field Composition

Consistent form field structure:

```typescript
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Field Label <span className="text-red-500">*</span>
      </FormLabel>
      <FormControl>
        <Input placeholder="Placeholder..." {...field} />
      </FormControl>
      <FormDescription>Helper text (optional)</FormDescription>
      <FormMessage /> {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

## Decision Trees

### When to Create a New Component?

```
Is this code duplicated in 2+ places?
│
├─ Yes → Extract to shared component
│   └─ Location: components/ (if cross-feature) or feature/components/ (if feature-specific)
│
└─ No → Is it complex enough (50+ lines)?
    │
    ├─ Yes → Extract for readability
    │   └─ Keep in same file or feature/components/
    │
    └─ No → Keep inline
```

### Container vs Presentational?

```
Does it need to fetch data or manage complex state?
│
├─ Yes → Container Component
│   ├─ Use React Query hooks
│   ├─ Manage filters, pagination
│   └─ Compose presentational components
│
└─ No → Presentational Component
    ├─ Receive all data via props
    ├─ Focus on rendering
    └─ Stateless or minimal local state
```

### Where to Put Component Files?

```
Is it a Shadcn UI component?
│
├─ Yes → components/ui/
│
└─ No → Is it used across multiple features?
    │
    ├─ Yes → components/
    │   └─ Examples: PageHeader, DeleteConfirmationModal
    │
    └─ No → app/(protected)/[feature]/components/
        └─ Keep it colocated with the feature
```

## Anti-Patterns

### ❌ Container Logic in Presentational Components

```typescript
// ❌ DON'T - Table fetching its own data
export function TreatmentTable() {
  const { treatments } = useGetAllTreatmentsQuery(); // ❌ Query in table

  return <Table>...</Table>;
}
```

```typescript
// ✅ DO - Container fetches, table receives props
export function TreatmentContainer() {
  const { treatments } = useGetAllTreatmentsQuery();
  return <TreatmentTable treatments={treatments} />;
}

export function TreatmentTable({ treatments }: { treatments: Treatment[] }) {
  return <Table>...</Table>;
}
```

### ❌ Prop Drilling Through Many Levels

```typescript
// ❌ DON'T - Passing callbacks through 4+ levels
<Container onDelete={handleDelete}>
  <Header onDelete={onDelete}>
    <Actions onDelete={onDelete}>
      <Button onClick={onDelete} />
    </Actions>
  </Header>
</Container>
```

```typescript
// ✅ DO - Use composition or context
<Container>
  <Header />
  <Actions>
    <Button onClick={handleDelete} /> {/* Direct handler */}
  </Actions>
</Container>
```

### ❌ Massive Single Components

```typescript
// ❌ DON'T - 500+ line component
export function PatientManagement() {
  // 500 lines of logic, fetching, rendering...
}
```

```typescript
// ✅ DO - Break into container + presentational
export function PatientManagementContainer() {
  // Data fetching and state (50 lines)
  return (
    <>
      <PatientHeader {...headerProps} />
      <PatientTable {...tableProps} />
    </>
  );
}

export function PatientHeader(props) { /* 50 lines */ }
export function PatientTable(props) { /* 100 lines */ }
```

### ❌ Using Shadcn Components Incorrectly

```typescript
// ❌ DON'T - Overriding base styles
<Button className="bg-blue-500 hover:bg-blue-600"> {/* Overrides variant */}
  Save
</Button>
```

```typescript
// ✅ DO - Use variants or extend
<Button variant="default">Save</Button>

// Or create custom variant in button.tsx
<Button variant="custom">Save</Button>
```

## Related Specifications

- [Styling & UI](./styling-ui.md) - Tailwind and Shadcn UI patterns
- [Form Patterns](./form-patterns.md) - Form component details
- [Table Patterns](./table-patterns.md) - Data table specifics
- [Testing](./testing.md) - Component testing strategies

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Container Component | `app/(protected)/patients/visit-list/components/visit-management-container.tsx` |
| Presentational Component | `app/(protected)/patients/visit-list/components/visit-management-header.tsx` |
| Form Component | `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx` |
| Table Component | `app/(protected)/masters/treatments/components/table/treatment-management-table.tsx` |
| Shadcn UI Component | `components/ui/button.tsx` |
| Page Component | `app/(protected)/patients/visit-list/page.tsx` |
