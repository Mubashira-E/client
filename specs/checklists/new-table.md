# Checklist: Creating a New Data Table

Use this checklist when adding a data table with filtering, pagination, and column visibility.

## 1. Define Column Definitions

- [ ] Create `components/data.ts` file
- [ ] Define `all[Entity]Columns` array
- [ ] Add id, name, and sortable properties for each column
- [ ] Include "actions" column at the end

**Example:**

```typescript
// components/data.ts
export const allTreatmentColumns = [
  { id: "treatmentCode", name: "Treatment Code", sortable: true },
  { id: "treatmentName", name: "Treatment Name", sortable: true },
  { id: "price", name: "Price", sortable: true },
  { id: "duration", name: "Duration (min)", sortable: false },
  { id: "actions", name: "Actions", sortable: false },
];
```

## 2. Create Zustand Store for Column Visibility

- [ ] Create `components/stores/use[Entity]ManagementStore.ts`
- [ ] Add `visibleColumns` state (string array)
- [ ] Add `toggleColumn` action
- [ ] Add `selectAllColumns` action
- [ ] Add `deselectAllColumns` action
- [ ] Set default visible columns (exclude optional ones)

**See:** [State Management Spec](../state-management.md#pattern-2-non-persisted-store-ui-state)

## 3. Create Table Component File Structure

- [ ] Create `components/table/` directory
- [ ] Create `[entity]-management-table.tsx` (main table)
- [ ] Create `[entity]-management-table-loader.tsx` (loading state)
- [ ] Create `[entity]-management-table-empty.tsx` (empty state)
- [ ] Create `[entity]-management-table-error.tsx` (error state)

## 4. Create Loading State Component

- [ ] Import Table components from Shadcn
- [ ] Import Skeleton from Shadcn
- [ ] Create table with skeleton rows (10 rows recommended)
- [ ] Match column count to visible columns

**Template:**

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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

## 5. Create Empty State Component

- [ ] Show centered message with icon
- [ ] Use `colSpan` to span all columns
- [ ] Add helpful icon (e.g., FileText, Users)

**Template:**

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

## 6. Create Error State Component

- [ ] Accept error prop
- [ ] Show error message with AlertCircle icon
- [ ] Use destructive color scheme

## 7. Create Main Table Component

### Component Setup

- [ ] Create component with props: data, isLoading, error, visibleColumns
- [ ] Add proper TypeScript types for props

### Rendering Logic

- [ ] Return loader if `isLoading`
- [ ] Return error state if `error`
- [ ] Return empty state if `data.length === 0`
- [ ] Otherwise render table

### renderCell Function

- [ ] Create `renderCell(item, columnId)` function
- [ ] Use switch statement based on columnId
- [ ] Handle each column type (text, number, formatted values)
- [ ] Handle "actions" column with dropdown menu

**Example:**

```typescript
function renderCell(treatment: Treatment, columnId: string) {
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
            <DropdownMenuItem onClick={() => onEdit(treatment.id)}>
              <Edit className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(treatment.id)}>
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
```

### Table Rendering

- [ ] Map over visibleColumns for headers
- [ ] Map over data items for rows
- [ ] Map over visibleColumns for cells
- [ ] Call renderCell for each cell

## 8. Create Container Component

- [ ] Create `[entity]-management-container.tsx`
- [ ] Add `"use client"` directive
- [ ] Import necessary hooks and components

### State Management

- [ ] Add URL state for search: `useQueryState("search")`
- [ ] Add URL state for pagination: `useQueryState("page")`
- [ ] Use Zustand store for column visibility

### Data Fetching

- [ ] Call `useGetAll[Entity]Query` with params
- [ ] Extract data, isLoading, error, totalPages

### Header Section

- [ ] Add search input with value and onChange
- [ ] Add column selector dropdown

**Column Selector Template:**

```typescript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Columns
      <SlidersHorizontal className="size-4 ml-1" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={selectAllColumns}>
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
```

### Table Section

- [ ] Render table component with props

### Pagination Section

- [ ] Add pagination controls
- [ ] Show current page and total pages
- [ ] Add Previous/Next buttons
- [ ] Disable buttons at boundaries

## 9. Add Action Handlers

### Edit Handler

- [ ] Create `handleEdit(id: string)` function
- [ ] Navigate to edit page: `router.push(/path/${id})`

### Delete Handler

- [ ] Add `deleteId` state: `useState<string | null>(null)`
- [ ] Create `handleDelete(id: string)` function to set deleteId
- [ ] Add delete confirmation modal
- [ ] Create `handleConfirmDelete` function
- [ ] Call delete mutation
- [ ] Show toast on success/error
- [ ] Clear deleteId on close

## 10. Testing

- [ ] Test loading state renders
- [ ] Test empty state shows when no data
- [ ] Test error state shows on error
- [ ] Test row rendering with data
- [ ] Test column visibility toggle
- [ ] Test search filtering
- [ ] Test pagination
- [ ] Test edit action
- [ ] Test delete action

**See:** [Testing Spec](../testing.md)

## 11. Final Checks

- [ ] All states (loading, error, empty, data) render correctly
- [ ] Column visibility persists during navigation
- [ ] Search updates URL and refetches data
- [ ] Pagination updates URL and refetches data
- [ ] Actions (edit, delete) work correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No TypeScript errors
- [ ] No console warnings

## Related Checklists

- [New CRUD Feature Checklist](./new-crud-feature.md)
- [New API Endpoint Checklist](./new-api-endpoint.md)

## References

- [Table Patterns Spec](../table-patterns.md)
- [Component Patterns Spec](../component-patterns.md)
- Example: `app/(protected)/masters/treatments/components/table/treatment-management-table.tsx`
