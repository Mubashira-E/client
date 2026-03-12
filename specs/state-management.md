# State Management Specification

## Overview

This application uses a layered state management approach with different tools for different types of state:

- **React Query** - Server state (API data, caching)
- **Zustand** - Global client state (auth, UI preferences)
- **nuqs** - URL state (filters, pagination, search)
- **React Hook Form** - Form state
- **useState** - Local component state

## State Layer Decision Tree

```
What type of state is this?
│
├─ Server data (from API)?
│   └─ Use React Query → See api-integration.md
│
├─ Should it persist across sessions?
│   ├─ Yes → Use Zustand with persistence
│   └─ No → Continue...
│
├─ Should it be shareable via URL?
│   ├─ Yes → Use nuqs (URL state)
│   │   └─ Examples: search filters, pagination, selected tabs
│   └─ No → Continue...
│
├─ Is it form data?
│   ├─ Yes → Use React Hook Form
│   └─ No → Continue...
│
├─ Is it global (shared across components)?
│   ├─ Yes → Use Zustand (without persistence)
│   └─ No → Use useState (local state)
```

## Zustand Patterns

### Pattern 1: Persisted Store (Auth)

For state that needs to persist across browser sessions.

**Example:** `stores/useAuthStore.ts:6`

```typescript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  jwtToken: string | null;
  hasAcceptedTerms: boolean;
  hasJustLoggedIn: boolean;
  setJwtToken: (token: string | null) => void;
  setHasAcceptedTerms: (hasAccepted: boolean) => void;
  setHasJustLoggedIn: (hasJustLoggedIn: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      jwtToken: null,
      hasAcceptedTerms: false,
      hasJustLoggedIn: false,
      setJwtToken: (jwtToken) => set({ jwtToken }),
      setHasAcceptedTerms: (hasAccepted) => set({ hasAcceptedTerms: hasAccepted }),
      setHasJustLoggedIn: (hasJustLoggedIn) => set({ hasJustLoggedIn }),
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

**Usage:**

```typescript
import { useAuthStore } from "@/stores/useAuthStore";

function LoginForm() {
  const setJwtToken = useAuthStore((state) => state.setJwtToken);

  async function handleLogin(credentials) {
    const { token } = await loginAPI(credentials);
    setJwtToken(token); // Persists to localStorage automatically
  }
}
```

**Access Outside React Components:**

```typescript
// In Axios interceptor or utility functions
const token = useAuthStore.getState().jwtToken;
useAuthStore.getState().setJwtToken(newToken);
```

### Pattern 2: Non-Persisted Store (UI State)

For global UI state that doesn't need persistence.

**Example:** `app/(protected)/patients/visit-list/components/stores/useVisitManagementStore.ts:3`

```typescript
import { create } from "zustand";

type VisitManagementStore = {
  visibleColumns: string[];
  toggleColumn: (columnId: string) => void;
  selectAllColumns: (columnIds: string[]) => void;
  deselectAllColumns: () => void;
};

export const useVisitManagementStore = create<VisitManagementStore>((set) => ({
  visibleColumns: ["emrNo", "patientName", "visitDate", "department", "actions"],

  toggleColumn: (columnId) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.includes(columnId)
        ? state.visibleColumns.filter((id) => id !== columnId)
        : [...state.visibleColumns, columnId],
    })),

  selectAllColumns: (columnIds) =>
    set({ visibleColumns: columnIds }),

  deselectAllColumns: () =>
    set({ visibleColumns: [] }),
}));
```

**Usage:**

```typescript
function VisitManagementContainer() {
  const { visibleColumns, toggleColumn, selectAllColumns } = useVisitManagementStore();

  return (
    <>
      <ColumnSelector
        visibleColumns={visibleColumns}
        onToggle={toggleColumn}
        onSelectAll={selectAllColumns}
      />
      <Table visibleColumns={visibleColumns} />
    </>
  );
}
```

### Pattern 3: Selector Pattern

Use selectors to subscribe to specific parts of the store:

```typescript
// ❌ DON'T - Component re-renders on ANY store change
const store = useAuthStore();

// ✅ DO - Only re-renders when jwtToken changes
const jwtToken = useAuthStore((state) => state.jwtToken);
const setJwtToken = useAuthStore((state) => state.setJwtToken);
```

## URL State with nuqs

### Pattern 1: Search and Filters

**Example:** `app/(protected)/patients/visit-list/components/visit-management-container.tsx:15`

```typescript
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function VisitManagementContainer() {
  // String parameter with default
  const [searchFilter, setSearchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault("")
  );

  // Number parameter with default
  const [currentPage, setCurrentPage] = useQueryState(
    "currentPage",
    parseAsInteger.withDefault(1)
  );

  // Use in API call
  const { visits } = useGetAllVisitQuery({
    searchTerms: searchFilter,
    pageNumber: currentPage,
  });

  return (
    <>
      <SearchInput
        value={searchFilter}
        onChange={setSearchFilter} // Updates URL automatically
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Updates URL automatically
      />
    </>
  );
}
```

**Benefits:**
- ✅ Shareable URLs: Copy URL to share filtered state
- ✅ Bookmarkable: Bookmark filtered views
- ✅ Browser back/forward works correctly
- ✅ No need to persist to localStorage

### Pattern 2: Multiple URL Parameters

```typescript
const [search, setSearch] = useQueryState("q", parseAsString);
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
const [sortBy, setSortBy] = useQueryState("sort", parseAsString.withDefault("name"));
const [department, setDepartment] = useQueryState("dept", parseAsString);
```

**Result URL:** `/patients?q=john&page=2&sort=date&dept=cardiology`

### Pattern 3: Array Parameters

```typescript
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

const [selectedIds, setSelectedIds] = useQueryState(
  "ids",
  parseAsArrayOf(parseAsString).withDefault([])
);
```

**Usage:**

```typescript
// Add to selection
setSelectedIds([...selectedIds, newId]);

// Remove from selection
setSelectedIds(selectedIds.filter((id) => id !== removedId));
```

## Local Component State

### When to Use useState

Use `useState` for ephemeral, local component state:

```typescript
function PatientTable() {
  // Modal open/closed
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Currently editing row
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dropdown expanded
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Table />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* Modal content */}
      </Dialog>
    </>
  );
}
```

**Characteristics:**
- State only needed in this component
- Doesn't need to persist
- Doesn't need to be in URL
- Not shared with other components

## Decision Trees

### Persist to localStorage or Not?

```
Should this state survive page refresh?
│
├─ Yes → Critical user data?
│   ├─ Yes (auth token, user settings) → Zustand with persist
│   └─ No (UI preferences) → Consider if it's worth persisting
│
└─ No → Use Zustand without persist or useState
```

### URL State vs Zustand?

```
Should users be able to share this state via URL?
│
├─ Yes → Use nuqs
│   └─ Examples: search, filters, pagination, selected tab
│
└─ No → Is it global (multiple components)?
    │
    ├─ Yes → Use Zustand
    │   └─ Examples: column visibility, theme, sidebar collapsed
    │
    └─ No → Use useState
        └─ Examples: modal open, dropdown expanded
```

### When to Use React Query vs Zustand?

```
Is this data from an API?
│
├─ Yes → Use React Query
│   └─ Benefits: caching, refetching, loading states
│
└─ No → Is it client-side only?
    └─ Yes → Use Zustand or useState
```

## State Composition Example

Typical feature using multiple state layers:

```typescript
function PatientManagementContainer() {
  // URL state - shareable filters
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Zustand - UI preferences
  const { visibleColumns, toggleColumn } = usePatientManagementStore();

  // React Query - server data
  const { patients, isLoading } = useGetAllPatientsQuery({
    searchTerms: search,
    pageNumber: page,
  });

  // Local state - modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Auth store - global auth
  const { jwtToken } = useAuthStore();

  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <PatientTable
        patients={patients}
        visibleColumns={visibleColumns}
        onDelete={setDeleteId}
      />
      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
```

## Anti-Patterns

### ❌ Using Zustand for Server Data

```typescript
// ❌ DON'T
const usePatientStore = create((set) => ({
  patients: [],
  fetchPatients: async () => {
    const data = await api.get("/api/v1/patient");
    set({ patients: data });
  },
}));
```

```typescript
// ✅ DO - Use React Query
const { patients } = useGetAllPatientsQuery({ pageNumber: 1 });
```

**Why?** React Query handles caching, refetching, and stale data automatically.

### ❌ Persisting Everything to localStorage

```typescript
// ❌ DON'T - Unnecessary persistence
const useTableStore = create(
  persist(
    (set) => ({
      isDropdownOpen: false, // No need to persist
      setIsDropdownOpen: (open) => set({ isDropdownOpen: open }),
    }),
    { name: "table-storage" }
  )
);
```

```typescript
// ✅ DO - Only persist what matters
const useTableStore = create((set) => ({
  visibleColumns: ["name", "date"], // Worth persisting
  isDropdownOpen: false, // Don't persist
  // ...
}));

// Or use two separate stores
```

### ❌ Not Using URL State for Filters

```typescript
// ❌ DON'T
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
```

```typescript
// ✅ DO - Makes URL shareable
const [search, setSearch] = useQueryState("search", parseAsString);
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
```

**Why?** Users can bookmark filtered views and share links.

### ❌ Prop Drilling When Zustand Could Help

```typescript
// ❌ DON'T
<Container user={user}>
  <Header user={user}>
    <Avatar user={user}>
      <Image src={user.avatar} />
    </Avatar>
  </Header>
</Container>
```

```typescript
// ✅ DO - Use Zustand for deeply shared state
// In store
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// In Avatar component (no prop drilling)
function Avatar() {
  const user = useUserStore((state) => state.user);
  return <Image src={user.avatar} />;
}
```

## Related Specifications

- [API Integration](./api-integration.md) - React Query for server state
- [Component Patterns](./component-patterns.md) - State in container components
- [Form Patterns](./form-patterns.md) - React Hook Form state

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Persisted Store | `stores/useAuthStore.ts` |
| UI Store | `app/(protected)/patients/visit-list/components/stores/useVisitManagementStore.ts` |
| URL State | `app/(protected)/patients/visit-list/components/visit-management-container.tsx` |
| Combined State | Visit management (URL + Zustand + React Query) |
