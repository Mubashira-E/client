# API Integration Specification

## Overview

This document defines patterns for integrating with backend APIs using React Query (TanStack Query v5) and Axios. All API calls use React Query hooks for caching, deduplication, and state management.

## Core Concepts

### Axios Configuration

All API calls go through the configured Axios instance in `lib/axios.ts`.

**Key Features:**
- Automatic JWT token injection via request interceptor
- Automatic snake_case → camelCase conversion via response interceptor
- Custom array parameter serialization
- Base URL from environment variable

**Example:** `lib/axios.ts:8`

```typescript
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://45.143.62.174:8022
  withCredentials: true,
  paramsSerializer: (params) => {
    // Custom serialization for arrays: key=val1&key=val2&key=val3
    return Object.entries(params)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${key}=${encodeURIComponent(v)}`);
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
  },
});

// Request interceptor - adds JWT token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().jwtToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - converts snake_case to camelCase
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = camelcaseKeys(response.data, { deep: true });
  }
  return response;
});

export { api };
```

**Usage:** Always import and use `api` from `@/lib/axios`, never create new Axios instances.

## Query Patterns

### Pattern 1: List Query Hook

For fetching paginated lists with filtering and sorting.

**Naming Convention:** `useGetAll[Entity]Query`

**File Location:** `queries/[domain]/useGetAll[Entity]Query.ts`

**Example:** `queries/visit/useGetAllVisitQuery.ts:8`

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { VisitListApiResponse } from "@/types/visit";

type Params = {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
};

export function useGetAllVisitQuery(params: Params) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getVisit,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<VisitListApiResponse>(generalEndpoints.getVisit, {
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
    visits: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
```

**Key Points:**
- ✅ Query key includes all filter parameters for proper caching
- ✅ Returns expanded object with extracted data properties
- ✅ Provides defaults for data, totalPages, totalItems
- ✅ Type-safe with TypeScript generics

**Usage in Component:**

```typescript
const { visits, isLoading, error, totalPages, refetch } = useGetAllVisitQuery({
  pageNumber: 1,
  searchTerms: "john",
  pageSize: 10,
});
```

### Pattern 2: Single Entity Query Hook

For fetching a single entity by ID.

**Naming Convention:** `useGet[Entity]ByIdQuery` or `useGet[Entity]Query`

**Example:** `queries/visit/useGetVisitByIdQuery.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { VisitDetails } from "@/types/visit";

export function useGetVisitByIdQuery(visitId: string) {
  const query = useQuery({
    queryKey: [generalEndpoints.getVisit, visitId],
    queryFn: () =>
      api.get<VisitDetails>(`${generalEndpoints.getVisit}/${visitId}`),
    enabled: !!visitId, // Only fetch if visitId exists
  });

  return {
    ...query,
    visit: query.data?.data,
  };
}
```

**Key Points:**
- ✅ Use `enabled` flag to prevent fetching with invalid IDs
- ✅ Query key includes entity ID for granular caching
- ✅ Return extracted data for convenience

### Pattern 3: Conditional/Dependent Query

For queries that depend on other data.

```typescript
export function usePatientVisitsQuery(patientId: string | null) {
  return useQuery({
    queryKey: ["patient-visits", patientId],
    queryFn: () => api.get(`/api/v1/patient/${patientId}/visits`),
    enabled: !!patientId, // Only fetch when patientId is available
  });
}
```

**Usage:**

```typescript
const { data: patient } = useGetPatientByIdQuery(id);
const { data: visits } = usePatientVisitsQuery(patient?.patientId ?? null);
```

## Mutation Patterns

### Pattern 1: Create Mutation Hook

For creating new entities (POST requests).

**Naming Convention:** `useCreate[Entity]MutationQuery`

**File Location:** `queries/[domain]/[entity]/useCreate[Entity]MutationQuery.ts`

**Example:** `queries/masters/treatments/useCreateTreatmentMutationQuery.ts:10`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { TreatmentRequest, TreatmentResponse } from "@/types/treatment";

// Zod validation schema
export const createTreatmentSchema = z.object({
  treatmentName: z.string().trim().min(2, {
    message: "Treatment name must be at least 2 characters",
  }),
  treatmentCode: z.string().trim().min(1, {
    message: "Treatment code is required",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),
  duration: z.number().min(0).optional(),
});

type Options = {
  onSuccess?: (data: TreatmentResponse) => void;
  onError?: (error: AxiosError) => void;
};

export function useCreateTreatmentMutationQuery(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TreatmentRequest) =>
      api.post<TreatmentResponse>(generalEndpoints.createTreatment, data),
    onSuccess: (response, variables, context) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatment],
      });

      // Call custom success handler
      options?.onSuccess?.(response.data);
    },
    onError: (error: AxiosError, variables, context) => {
      options?.onError?.(error);
    },
  });
}
```

**Key Points:**
- ✅ Include Zod schema for validation
- ✅ Invalidate related queries on success
- ✅ Accept options for custom callbacks
- ✅ Type-safe error handling with AxiosError

**Usage in Component:**

```typescript
import { toast } from "sonner";
import { useCreateTreatmentMutationQuery, createTreatmentSchema } from "@/queries/...";

function AddTreatmentForm() {
  const form = useForm({
    resolver: zodResolver(createTreatmentSchema),
  });

  const { mutateAsync, isPending } = useCreateTreatmentMutationQuery({
    onSuccess: () => {
      toast.success("Treatment created successfully");
      router.push("/masters/treatments");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating treatment");
    },
  });

  async function onSubmit(data: TreatmentRequest) {
    await mutateAsync(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <Button type="submit" isLoading={isPending}>Create</Button>
      </form>
    </Form>
  );
}
```

### Pattern 2: Update Mutation Hook

For updating existing entities (PUT requests).

**Naming Convention:** `useUpdate[Entity]MutationQuery`

**Example:** `queries/masters/treatments/useUpdateTreatmentMutationQuery.ts:10`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";
import type { TreatmentRequest, TreatmentResponse } from "@/types/treatment";

// Reuse create schema or create update-specific schema
export const updateTreatmentSchema = z.object({
  treatmentId: z.uuid(),
  treatmentName: z.string().trim().min(2),
  treatmentCode: z.string().trim().min(1),
  price: z.number().min(0),
});

type Variables = {
  id: string;
  data: TreatmentRequest;
};

type Options = {
  onSuccess?: (data: TreatmentResponse) => void;
  onError?: (error: AxiosError) => void;
};

export function useUpdateTreatmentMutationQuery(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Variables) =>
      api.put<TreatmentResponse>(`${generalEndpoints.updateTreatment}/${id}`, data),
    onSuccess: (response) => {
      // Invalidate list and detail queries
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatment],
      });

      options?.onSuccess?.(response.data);
    },
    onError: options?.onError,
  });
}
```

**Usage:**

```typescript
const { mutateAsync } = useUpdateTreatmentMutationQuery({
  onSuccess: () => toast.success("Treatment updated"),
});

await mutateAsync({ id: treatmentId, data: formData });
```

### Pattern 3: Delete Mutation Hook

For deleting entities (DELETE requests).

**Naming Convention:** `useDelete[Entity]MutationQuery`

**Example:**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { generalEndpoints } from "@/endpoints";

export function useDeleteTreatmentMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`${generalEndpoints.deleteTreatment}/${id}`),
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getTreatment],
      });
    },
  });
}
```

**Usage with Confirmation Dialog:**

```typescript
const [deleteId, setDeleteId] = useState<string | null>(null);
const { mutateAsync, isPending } = useDeleteTreatmentMutationQuery();

async function handleConfirmDelete() {
  if (!deleteId) return;

  await mutateAsync(deleteId, {
    onSuccess: () => {
      toast.success("Treatment deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete treatment");
    },
  });
}

return (
  <>
    {/* Trigger delete */}
    <Button onClick={() => setDeleteId(treatment.id)}>Delete</Button>

    {/* Confirmation dialog */}
    <DeleteConfirmationModal
      open={!!deleteId}
      onOpenChange={(open) => !open && setDeleteId(null)}
      onConfirm={handleConfirmDelete}
      itemName="treatment"
    />
  </>
);
```

## Query Key Patterns

### Best Practices

Query keys should be arrays that uniquely identify the query and include all parameters that affect the result.

```typescript
// ✅ Good - Includes all filter parameters
queryKey: [endpoint, pageNumber, searchTerms, sortOrder]

// ✅ Good - Entity with ID
queryKey: ["patient", patientId]

// ✅ Good - Nested resource
queryKey: ["patient", patientId, "visits"]

// ❌ Bad - Missing filter parameters
queryKey: [endpoint] // Will use cached data even when filters change

// ❌ Bad - Using objects (not comparable)
queryKey: [endpoint, { page: 1, search: "x" }] // Use array values instead
```

### Invalidation Patterns

Invalidate queries after mutations to refetch fresh data:

```typescript
// Invalidate all queries with this endpoint
queryClient.invalidateQueries({
  queryKey: [generalEndpoints.getTreatment],
});

// Invalidate specific entity
queryClient.invalidateQueries({
  queryKey: ["treatment", treatmentId],
});

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === generalEndpoints.getTreatment,
});
```

## Error Handling Patterns

### Pattern 1: Hook-Level Error Handling

Handle errors in the mutation hook:

```typescript
const { mutateAsync } = useCreateTreatmentMutationQuery({
  onError: (error) => {
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);
  },
});
```

### Pattern 2: Component-Level Error Handling

Handle errors in the component:

```typescript
try {
  await mutateAsync(data);
  toast.success("Created successfully");
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || "Failed to create");
  }
}
```

### Pattern 3: Query Error Display

Display query errors in UI:

```typescript
const { data, isLoading, error, isError } = useGetAllTreatmentsQuery({});

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || "Failed to load treatments"}
      </AlertDescription>
    </Alert>
  );
}
```

## Loading State Patterns

### Pattern 1: Query Loading States

```typescript
const { data, isLoading, isFetching, isRefetching } = useGetAllPatientsQuery({});

// isLoading - First load (no cached data)
// isFetching - Any fetch (including background refetch)
// isRefetching - Background refetch (has cached data)

if (isLoading) {
  return <TableSkeleton />;
}

return (
  <>
    {isFetching && <LoadingSpinner />}
    <Table data={data} />
  </>
);
```

### Pattern 2: Mutation Loading States

```typescript
const { mutateAsync, isPending, isSuccess } = useCreatePatientMutationQuery();

return (
  <Button type="submit" isLoading={isPending} disabled={isPending || isSuccess}>
    {isSuccess ? "Created!" : "Create Patient"}
  </Button>
);
```

## Decision Trees

### Query vs Mutation?

```
Is this a data-fetching operation (GET)?
│
├─ Yes → Use useQuery
│   └─ Examples: Fetch list, fetch by ID, fetch related data
│
└─ No → Is it a data-changing operation (POST, PUT, DELETE)?
    └─ Yes → Use useMutation
        └─ Examples: Create, update, delete
```

### When to Enable/Disable Queries?

```
Should the query run immediately?
│
├─ Yes → Don't use enabled flag
│
└─ No → Why shouldn't it run?
    │
    ├─ Missing required parameter → enabled: !!parameter
    │
    ├─ User action required → enabled: shouldFetch (state variable)
    │
    └─ Dependent on other query → enabled: !!dependentData
```

### When to Invalidate vs Set Query Data?

```
After mutation, do you know the exact new data?
│
├─ Yes → Use setQueryData for instant update
│   └─ Example: After delete, remove from cached list
│
└─ No → Invalidate to refetch from server
    └─ Example: After create, refetch list (might have server-generated fields)
```

## Anti-Patterns

### ❌ Direct Axios Calls in Components

```typescript
// ❌ DON'T
function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get("/api/v1/patient").then(res => setPatients(res.data));
  }, []);
}
```

```typescript
// ✅ DO
function PatientList() {
  const { patients, isLoading } = useGetAllPatientsQuery({ pageNumber: 1 });
}
```

### ❌ Not Including Parameters in Query Key

```typescript
// ❌ DON'T - Missing searchTerms in key
export function useGetAllVisitQuery(params: Params) {
  return useQuery({
    queryKey: [endpoint], // ❌ Doesn't include params
    queryFn: () => api.get(endpoint, { params }),
  });
}
// Result: Search changes won't refetch!
```

```typescript
// ✅ DO
export function useGetAllVisitQuery(params: Params) {
  return useQuery({
    queryKey: [endpoint, params.pageNumber, params.searchTerms], // ✅
    queryFn: () => api.get(endpoint, { params }),
  });
}
```

### ❌ Not Invalidating After Mutations

```typescript
// ❌ DON'T
export function useCreatePatientMutationQuery() {
  return useMutation({
    mutationFn: (data) => api.post("/api/v1/patient", data),
    // ❌ No invalidation - list won't update!
  });
}
```

```typescript
// ✅ DO
export function useCreatePatientMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post("/api/v1/patient", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [generalEndpoints.getPatient], // ✅ Refetch list
      });
    },
  });
}
```

### ❌ Creating New Axios Instances

```typescript
// ❌ DON'T
const customApi = axios.create({ baseURL: "..." });
```

```typescript
// ✅ DO
import { api } from "@/lib/axios"; // Use configured instance
```

## Related Specifications

- [State Management](./state-management.md) - When to use React Query vs other state
- [Error Handling](./error-handling.md) - Detailed error handling patterns
- [Form Patterns](./form-patterns.md) - Using mutations with forms
- [Testing](./testing.md) - Testing queries and mutations

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| List Query | `queries/visit/useGetAllVisitQuery.ts` |
| Create Mutation | `queries/masters/treatments/useCreateTreatmentMutationQuery.ts` |
| Update Mutation | `queries/masters/treatments/useUpdateTreatmentMutationQuery.ts` |
| Axios Configuration | `lib/axios.ts` |
| Error Handling | `app/login/components/login-form.tsx` |
