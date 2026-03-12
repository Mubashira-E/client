# Table Patterns Specification

## Overview

Data tables are a core UI pattern in this EMR application. Tables support dynamic column visibility, server-side pagination, filtering, and row actions.

## Standard Table Architecture

### Component Structure

```
Container Component
├─ Header (search, filters, column selector)
├─ Table Component
│   ├─ Table (Shadcn)
│   ├─ TableLoader (loading state)
│   ├─ TableError (error state)
│   └─ TableEmpty (empty state)
└─ Pagination
```

## Complete Table Example

**Container:** `app/(protected)/masters/treatments/components/treatment-management-container.tsx`

```typescript
"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useGetAllTreatmentsQuery } from "@/queries/masters/treatments/useGetAllTreatmentsQuery";
import { useTreatmentManagementStore } from "./stores/useTreatmentManagementStore";
import { TreatmentManagementTable } from "./table/treatment-management-table";

export function TreatmentManagementContainer() {
  // URL state for filters
  const [searchFilter, setSearchFilter] = useQueryState("search", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Store for column visibility
  const { visibleColumns, toggleColumn, selectAllColumns, deselectAllColumns } = useTreatmentManagementStore();

  // Fetch data
  const { treatments, isLoading, error, totalPages } = useGetAllTreatmentsQuery({
    searchTerms: searchFilter,
    pageNumber: currentPage,
    pageSize: 10,
  });

  return (
    <div className="space-y-4">
      {/* Search and Column Selector */}
      <div className="flex items-center gap-2">
        <Input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns
              <SlidersHorizontal className="size-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => selectAllColumns(allColumnIds)}>
              Select All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={visibleColumns.includes(col.id)}
                onCheckedChange={() => toggleColumn(col.id)}
              >
                {col.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <TreatmentManagementTable
        treatments={treatments}
        isLoading={isLoading}
        error={error}
        visibleColumns={visibleColumns}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

**Table Component:**

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

type Props = {
  treatments: TreatmentManagementResponse[];
  isLoading: boolean;
  error?: Error | null;
  visibleColumns: string[];
};

export function TreatmentManagementTable({ treatments, isLoading, error, visibleColumns }: Props) {
  if (isLoading) return <TreatmentManagementTableLoader />;
  if (error) return <TreatmentManagementTableError error={error} />;
  if (treatments.length === 0) return <TreatmentManagementTableEmpty />;

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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(treatment.treatmentId)}>
                <Edit className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(treatment.treatmentId)}>
                <Trash2 className="size-4 mr-2" />
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
            <TableHead key={columnId}>{getColumnName(columnId)}</TableHead>
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

## Table State Components

### Loading State

```typescript
export function TreatmentManagementTableLoader() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 5 }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Empty State

```typescript
export function TreatmentManagementTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <FileText className="size-8" />
          <p>No treatments found</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
```

### Error State

```typescript
export function TreatmentManagementTableError({ error }: { error: Error }) {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <AlertCircle className="size-8" />
          <p>Error loading treatments: {error.message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
```

## Column Definitions

Define columns in a separate file:

**File:** `app/(protected)/masters/treatments/components/data.ts`

```typescript
export const allTreatmentColumns = [
  { id: "treatmentCode", name: "Treatment Code", sortable: true },
  { id: "treatmentName", name: "Treatment Name", sortable: true },
  { id: "price", name: "Price", sortable: true },
  { id: "duration", name: "Duration", sortable: false },
  { id: "actions", name: "Actions", sortable: false },
];
```

## Column Visibility Store

```typescript
import { create } from "zustand";

type TreatmentManagementStore = {
  visibleColumns: string[];
  toggleColumn: (columnId: string) => void;
  selectAllColumns: (columnIds: string[]) => void;
  deselectAllColumns: () => void;
};

export const useTreatmentManagementStore = create<TreatmentManagementStore>((set) => ({
  visibleColumns: ["treatmentCode", "treatmentName", "price", "actions"],

  toggleColumn: (columnId) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.includes(columnId)
        ? state.visibleColumns.filter((id) => id !== columnId)
        : [...state.visibleColumns, columnId],
    })),

  selectAllColumns: (columnIds) => set({ visibleColumns: columnIds }),

  deselectAllColumns: () => set({ visibleColumns: [] }),
}));
```

## Pagination Pattern

```typescript
<div className="flex items-center justify-between">
  <p className="text-sm text-gray-600">
    Page {currentPage} of {totalPages}
  </p>
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
</div>
```

## Decision Trees

### Client vs Server-Side Pagination?

```
Is the data set large (100+ items)?
│
├─ Yes → Server-side pagination
│   └─ Pass pageNumber to API query
│
└─ No (<100 items) → Client-side pagination acceptable
    └─ Fetch all, paginate in component
```

### When to Add Column Visibility?

```
Does the table have 6+ columns?
│
├─ Yes → Add column visibility selector
│   └─ Users can customize view
│
└─ No (<6 columns) → Skip column selector
    └─ All columns always visible
```

## Anti-Patterns

### ❌ Hardcoded Column Rendering

```typescript
// ❌ DON'T
return (
  <TableRow>
    <TableCell>{treatment.code}</TableCell>
    <TableCell>{treatment.name}</TableCell>
    {/* Can't hide columns dynamically */}
  </TableRow>
);
```

```typescript
// ✅ DO
return (
  <TableRow>
    {visibleColumns.map((columnId) => (
      <TableCell>{renderCell(treatment, columnId)}</TableCell>
    ))}
  </TableRow>
);
```

### ❌ No Loading/Empty States

```typescript
// ❌ DON'T
return (
  <Table>
    {data.map(item => <TableRow>...</TableRow>)}
  </Table>
);
```

```typescript
// ✅ DO
if (isLoading) return <Loader />;
if (data.length === 0) return <Empty />;
return <Table>...</Table>;
```

## Related Specifications

- [Component Patterns](./component-patterns.md) - Table component structure
- [State Management](./state-management.md) - Column visibility state
- [API Integration](./api-integration.md) - Fetching table data

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Complete Table | `app/(protected)/masters/treatments/components/table/treatment-management-table.tsx` |
| Column Definitions | `app/(protected)/patients/visit-list/components/data.ts` |
| Column Visibility Store | `app/(protected)/patients/visit-list/components/stores/useVisitManagementStore.ts` |
