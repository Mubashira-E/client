# Checklist: Integrating a New API Endpoint

Use this checklist when integrating a new backend API endpoint with React Query.

## 1. Add Endpoint Constant

- [ ] Open `endpoints/index.ts`
- [ ] Add new endpoint constant to appropriate section
- [ ] Use descriptive name matching operation (e.g., `getPackages`, `createPackage`)

**Example:**

```typescript
// endpoints/index.ts
export const generalEndpoints = {
  // ... existing endpoints
  getPackage: "/api/v1/package",
  createPackage: "/api/v1/package",
  updatePackage: "/api/v1/package",
  deletePackage: "/api/v1/package",
};
```

## 2. Define TypeScript Types

- [ ] Create or update type file in `types/` directory
- [ ] Define response type (e.g., `PackageResponse`)
- [ ] Define request type (e.g., `PackageRequest`)
- [ ] Define list response wrapper if paginated

**Example:**

```typescript
// types/package.ts
export type PackageResponse = {
  packageId: string;
  packageName: string;
  price: number;
  // ... other fields
};

export type PackageRequest = {
  packageName: string;
  price: number;
  // ... other fields
};

export type PackageListApiResponse = {
  data: {
    items: PackageResponse[];
    pageCount: number;
    totalCount: number;
  };
};
```

## 3. Choose Hook Type

Determine which type of hook to create:

- **GET (list)** → `useGetAll[Entity]Query` (query hook)
- **GET (single)** → `useGet[Entity]ByIdQuery` (query hook)
- **POST** → `useCreate[Entity]MutationQuery` (mutation hook)
- **PUT** → `useUpdate[Entity]MutationQuery` (mutation hook)
- **DELETE** → `useDelete[Entity]MutationQuery` (mutation hook)

## 4. For Query Hooks (GET requests)

### List Query

- [ ] Create file: `queries/[domain]/useGetAll[Entity]Query.ts`
- [ ] Import `useQuery` from @tanstack/react-query
- [ ] Import `api` from @/lib/axios
- [ ] Import endpoint from endpoints
- [ ] Import types

**Structure:**

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { PackageListApiResponse } from "@/types/package";

type Params = {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
};

export function useGetAllPackagesQuery(params: Params) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getPackage,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<PackageListApiResponse>(generalEndpoints.getPackage, {
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerms: params.searchTerms,
          SortOrderBy: params.sortOrderBy,
        },
      }),
  });

  return {
    ...query,
    packages: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
```

**Checklist:**

- [ ] Query key includes all filter parameters
- [ ] API call uses snake_case for params (backend convention)
- [ ] Return expanded object with extracted data
- [ ] Provide defaults for data properties

### Single Entity Query

- [ ] Create file: `queries/[domain]/useGet[Entity]ByIdQuery.ts`
- [ ] Accept ID parameter
- [ ] Use `enabled` flag: `enabled: !!id`
- [ ] Include ID in query key

**Example:**

```typescript
export function useGetPackageByIdQuery(packageId: string) {
  const query = useQuery({
    queryKey: [generalEndpoints.getPackage, packageId],
    queryFn: () =>
      api.get<PackageResponse>(`${generalEndpoints.getPackage}/${packageId}`),
    enabled: !!packageId,
  });

  return {
    ...query,
    package: query.data?.data,
  };
}
```

## 5. For Mutation Hooks (POST, PUT, DELETE)

### Create Mutation (POST)

- [ ] Create file: `queries/[domain]/useCreate[Entity]MutationQuery.ts`
- [ ] Import `useMutation`, `useQueryClient` from @tanstack/react-query
- [ ] Import `AxiosError` from axios
- [ ] Import `z` from zod
- [ ] Define Zod validation schema
- [ ] Export schema for use in forms

**Structure:**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { PackageRequest, PackageResponse } from "@/types/package";

// Zod validation schema
export const createPackageSchema = z.object({
  packageName: z.string().trim().min(2, {
    message: "Package name must be at least 2 characters",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),
  // ... other fields
});

type Options = {
  onSuccess?: (data: PackageResponse) => void;
  onError?: (error: AxiosError) => void;
};

export function useCreatePackageMutationQuery(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PackageRequest) =>
      api.post<PackageResponse>(generalEndpoints.createPackage, data),
    onSuccess: (response) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage],
      });

      options?.onSuccess?.(response.data);
    },
    onError: options?.onError,
  });
}
```

**Checklist:**

- [ ] Zod schema defined with validation messages
- [ ] Schema exported for form use
- [ ] Options type allows custom callbacks
- [ ] Query invalidation on success
- [ ] Type-safe error handling with AxiosError

### Update Mutation (PUT)

- [ ] Create file: `queries/[domain]/useUpdate[Entity]MutationQuery.ts`
- [ ] Accept both ID and data in mutation variables
- [ ] Include ID in URL path
- [ ] Invalidate list and detail queries

**Example:**

```typescript
type Variables = {
  id: string;
  data: PackageRequest;
};

export function useUpdatePackageMutationQuery(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Variables) =>
      api.put<PackageResponse>(`${generalEndpoints.updatePackage}/${id}`, data),
    onSuccess: (response, variables) => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage],
      });

      // Invalidate specific entity query
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage, variables.id],
      });

      options?.onSuccess?.(response.data);
    },
    onError: options?.onError,
  });
}
```

### Delete Mutation (DELETE)

- [ ] Create file: `queries/[domain]/useDelete[Entity]MutationQuery.ts`
- [ ] Accept ID as mutation variable
- [ ] Invalidate list queries on success

**Example:**

```typescript
export function useDeletePackageMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`${generalEndpoints.deletePackage}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPackage],
      });
    },
  });
}
```

## 6. Usage in Components

### Query Hook Usage

```typescript
const { packages, isLoading, error, refetch } = useGetAllPackagesQuery({
  pageNumber: 1,
  searchTerms: searchFilter,
  pageSize: 10,
});
```

### Mutation Hook Usage

```typescript
const { mutateAsync, isPending } = useCreatePackageMutationQuery({
  onSuccess: () => {
    toast.success("Package created successfully");
    router.push("/packages");
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || "Error creating package");
  },
});

async function onSubmit(data: PackageRequest) {
  await mutateAsync(data);
}
```

## 7. Testing (Optional)

- [ ] Test successful data fetching
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test mutation success
- [ ] Test mutation error

**See:** [Testing Spec](../testing.md)

## 8. Final Checks

- [ ] Endpoint added to `endpoints/index.ts`
- [ ] Types defined in `types/` directory
- [ ] Query/Mutation hook created
- [ ] Query key includes all relevant parameters
- [ ] Invalidation strategy implemented for mutations
- [ ] Zod schema defined for mutations
- [ ] Error handling implemented
- [ ] Hook tested in component
- [ ] No TypeScript errors
- [ ] API calls work correctly

## Common Patterns

### Pagination Parameters

Backend expects PascalCase, transform in params:

```typescript
params: {
  PageNumber: params.pageNumber,
  PageSize: params.pageSize,
  SearchTerms: params.searchTerms,
  SortOrderBy: params.sortOrderBy,
}
```

### Query Key Best Practices

```typescript
// ✅ Good - All filter params in key
queryKey: [endpoint, pageNumber, searchTerms, sortOrder]

// ❌ Bad - Missing params, will cache incorrectly
queryKey: [endpoint]
```

### Response Transformation

Axios interceptor handles camelCase conversion automatically, but extract data for convenience:

```typescript
return {
  ...query,
  items: query.data?.data.items || [],  // Extract and provide default
  totalPages: query.data?.data.pageCount || 1,
};
```

## Related Checklists

- [New CRUD Feature Checklist](./new-crud-feature.md)
- [New Form Checklist](./new-form.md)

## References

- [API Integration Spec](../api-integration.md)
- [TypeScript Spec](../typescript.md)
- Example: `queries/visit/useGetAllVisitQuery.ts`
- Example: `queries/masters/treatments/useCreateTreatmentMutationQuery.ts`
