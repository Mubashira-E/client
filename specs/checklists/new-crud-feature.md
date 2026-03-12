# Checklist: Adding a New CRUD Feature

Use this checklist when adding a complete CRUD (Create, Read, Update, Delete) feature to the application.

## Example

Adding a "Packages" master data feature with list, create, edit, and delete functionality.

## 1. Define Types

- [ ] Create `types/package.ts`
- [ ] Define `Package` type (basic entity)
- [ ] Define `PackageManagementResponse` type (list item)
- [ ] Define `PackageDetails` type (detailed view)
- [ ] Define `PackageRequest` type (create/update payload)
- [ ] Define `PackageListApiResponse` type (API wrapper)

**Example:**

```typescript
// types/package.ts
export type PackageManagementResponse = {
  packageId: string;
  packageCode: string;
  packageName: string;
  price: number;
  duration: number;
  createdDate?: string;
  updatedDate?: string;
};

export type PackageRequest = {
  packageCode: string;
  packageName: string;
  price: number;
  duration: number;
};

export type PackageListApiResponse = {
  data: {
    items: PackageManagementResponse[];
    pageCount: number;
    totalCount: number;
  };
};
```

## 2. Add API Endpoints

- [ ] Add endpoints to `endpoints/index.ts`
- [ ] Add `getPackage` endpoint
- [ ] Add `createPackage` endpoint
- [ ] Add `updatePackage` endpoint
- [ ] Add `deletePackage` endpoint

**Example:**

```typescript
// endpoints/index.ts
export const generalEndpoints = {
  // ... other endpoints
  getPackage: "/api/v1/package",
  createPackage: "/api/v1/package",
  updatePackage: "/api/v1/package",
  deletePackage: "/api/v1/package",
};
```

## 3. Create React Query Hooks

- [ ] Create `queries/masters/packages/` directory
- [ ] Create `useGetAllPackagesQuery.ts` (list query)
- [ ] Create `useGetPackageByIdQuery.ts` (single query)
- [ ] Create `useCreatePackageMutationQuery.ts` (create mutation with Zod schema)
- [ ] Create `useUpdatePackageMutationQuery.ts` (update mutation)
- [ ] Create `useDeletePackageMutationQuery.ts` (delete mutation)

**See:** [API Integration Spec](../api-integration.md)

## 4. Create Directory Structure

- [ ] Create `app/(protected)/masters/packages/` directory
- [ ] Create `page.tsx` (list page)
- [ ] Create `create/page.tsx` (create page)
- [ ] Create `edit/[id]/page.tsx` (edit page)
- [ ] Create `components/` directory

## 5. Create Zustand Store (if needed)

- [ ] Create `components/stores/usePackageManagementStore.ts`
- [ ] Add `visibleColumns` state
- [ ] Add `toggleColumn` action
- [ ] Add `selectAllColumns` action
- [ ] Add `deselectAllColumns` action

**See:** [State Management Spec](../state-management.md)

## 6. Create Column Definitions

- [ ] Create `components/data.ts`
- [ ] Define `allPackageColumns` array with id, name, sortable properties

**Example:**

```typescript
// components/data.ts
export const allPackageColumns = [
  { id: "packageCode", name: "Package Code", sortable: true },
  { id: "packageName", name: "Package Name", sortable: true },
  { id: "price", name: "Price", sortable: true },
  { id: "duration", name: "Duration", sortable: false },
  { id: "actions", name: "Actions", sortable: false },
];
```

## 7. Create Table Components

- [ ] Create `components/table/` directory
- [ ] Create `package-management-table.tsx` (main table)
- [ ] Create `package-management-table-loader.tsx` (loading state)
- [ ] Create `package-management-table-empty.tsx` (empty state)
- [ ] Create `package-management-table-error.tsx` (error state)

**See:** [Table Patterns Spec](../table-patterns.md)

## 8. Create Container Component

- [ ] Create `components/package-management-container.tsx`
- [ ] Add URL state for search and pagination (nuqs)
- [ ] Add Zustand store for column visibility
- [ ] Add `useGetAllPackagesQuery` hook
- [ ] Add search input
- [ ] Add column selector dropdown
- [ ] Add table component
- [ ] Add pagination

**See:** [Component Patterns Spec](../component-patterns.md)

## 9. Create List Page

- [ ] Create `app/(protected)/masters/packages/page.tsx`
- [ ] Import and render container component
- [ ] Add metadata (optional)

## 10. Create Form Component

- [ ] Create `create/components/add-package-form.tsx`
- [ ] Add React Hook Form setup with Zod resolver
- [ ] Add form fields (use FormField pattern)
- [ ] Add required field indicators (*)
- [ ] Add submit handler with mutation
- [ ] Add loading state on submit button
- [ ] Add toast notifications for success/error
- [ ] Add cancel button with router.back()
- [ ] Make form dual-purpose (accept initialData, isEditMode props)

**See:** [Form Patterns Spec](../form-patterns.md)

## 11. Create Create Page

- [ ] Create `create/page.tsx`
- [ ] Add back link to list page
- [ ] Add page header
- [ ] Render form component

## 12. Create Edit Page

- [ ] Create `edit/[id]/page.tsx`
- [ ] Get ID from useParams()
- [ ] Fetch existing data with `useGetPackageByIdQuery`
- [ ] Show loading state while fetching
- [ ] Render form with initialData and isEditMode

## 13. Add Delete Functionality

- [ ] In table component, add delete dropdown item
- [ ] In container, add deleteId state
- [ ] In container, add delete confirmation modal
- [ ] Handle delete with `useDeletePackageMutationQuery`
- [ ] Show toast on success/error

## 14. Add Navigation (Optional)

- [ ] Add to sidebar navigation in `app/(protected)/components/app-sidebar/index.tsx`

**Example:**

```typescript
<SidebarGroup>
  <SidebarGroupLabel>Masters</SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu>
      {/* Other items */}
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/masters/packages">
            <Package className="size-4" />
            <span>Packages</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
```

## 15. Testing (Optional)

- [ ] Create `components/table/package-management-table.test.tsx`
- [ ] Test loading state
- [ ] Test empty state
- [ ] Test error state
- [ ] Test row rendering

**See:** [Testing Spec](../testing.md)

## 16. Final Checks

- [ ] Test create functionality
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Test search/filtering
- [ ] Test pagination
- [ ] Test column visibility toggle
- [ ] Test error handling (network errors, validation errors)
- [ ] Test loading states
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Review TypeScript types (no `any`)
- [ ] Run linter (`bun run lint`)
- [ ] Run tests if created (`bun run test`)

## Related Checklists

- [New Form Checklist](./new-form.md)
- [New Table Checklist](./new-table.md)
- [New API Endpoint Checklist](./new-api-endpoint.md)

## Example Implementation

See: `app/(protected)/masters/treatments/` for complete reference implementation.
