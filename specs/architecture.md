# Architecture Specification

## Overview

This document describes the system architecture of the Ayurvedic EMR Client application - a modern Next.js 15 application built with TypeScript, React Query, and Zustand for state management.

## Tech Stack

### Core Framework

- **Next.js 15** with App Router
  - Server and client components
  - File-based routing
  - Experimental view transitions
  - React 19

### State Management

- **@tanstack/react-query (v5)** - Server state management
- **Zustand** - Client state management with localStorage persistence
- **nuqs** - URL-based state management
- **React Hook Form** - Form state management

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Radix UI primitives with custom styling
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Data & API

- **Axios** - HTTP client with interceptors
- **Zod** - Schema validation
- **camelcase-keys** - Automatic case conversion

### Development Tools

- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **Testing Library** - Component testing
- **ESLint** - Code linting (@antfu/eslint-config)
- **Bun** - Package manager and runtime

## Directory Structure

```
ayurvedic-client/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (require auth)
│   │   ├── layout.tsx          # Protected layout with sidebar
│   │   ├── patients/           # Patient management
│   │   │   ├── patient-list/
│   │   │   └── visit-list/
│   │   │       └── [id]/view/  # Dynamic routes
│   │   ├── masters/            # Master data configuration
│   │   │   ├── treatments/
│   │   │   ├── rooms/
│   │   │   ├── packages/
│   │   │   └── ...
│   │   └── excel-upload/       # Bulk operations
│   ├── login/                   # Public auth pages
│   ├── debug/                   # Debug utilities
│   ├── layout.tsx               # Root layout
│   └── global.css               # Global styles
│
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   └── page-header.tsx          # Shared components
│
├── queries/                      # React Query hooks
│   ├── auth/                    # Authentication queries
│   ├── general/                 # General/master data
│   ├── masters/                 # Master data mutations
│   ├── patient/                 # Patient queries
│   └── visit/                   # Visit queries
│
├── stores/                       # Zustand stores
│   └── useAuthStore.ts          # Auth state (JWT, terms acceptance)
│
├── lib/                          # Utilities and shared libraries
│   ├── axios.ts                 # Configured Axios instance
│   ├── utils.ts                 # General utilities (cn helper)
│   ├── date-time-utils.ts       # Date/time helpers
│   └── components/              # Shared component utilities
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication logic
│   └── use-mobile.ts            # Responsive breakpoint detection
│
├── types/                        # TypeScript type definitions
│   ├── visit.ts
│   ├── patient.ts
│   └── ...
│
├── endpoints/                    # API endpoint constants (deprecated)
│   └── index.ts                 # Use 03 How/endpoints.json instead
│
├── 03 How/                       # API documentation
│   └── endpoints.json           # OpenAPI 3.0 specification
│
└── specs/                        # Development specifications
    ├── README.md
    └── ...
```

## Data Flow Architecture

### 1. Request Flow (User Action → API → UI Update)

```
User Action (Click, Form Submit)
    ↓
React Component Event Handler
    ↓
React Query Mutation/Query Hook
    ↓
Axios Instance (lib/axios.ts)
    ↓ (adds JWT token via interceptor)
Backend API
    ↓ (returns snake_case data)
Axios Response Interceptor
    ↓ (converts to camelCase)
React Query Cache Update
    ↓
Component Re-render with New Data
```

### 2. Authentication Flow

```
Login Form Submit
    ↓
useLoginMutationQuery hook
    ↓
API: POST /api/user/login
    ↓
Response with JWT token
    ↓
useAuthStore.setJwtToken(token)
    ↓ (persisted to localStorage)
Axios Request Interceptor adds token to all requests
    ↓
Protected Routes accessible
```

### 3. Page Load Flow

```
Navigate to /patients/patient-list
    ↓
Next.js App Router
    ↓
Protected Layout checks auth
    ↓
Page Component renders
    ↓
Container Component with useGetAllPatientsQuery
    ↓
React Query checks cache
    ↓ (if stale or missing)
Axios GET request to API
    ↓
Data transformed (snake_case → camelCase)
    ↓
Table Component renders with data
```

## Key Architectural Patterns

### Pattern 1: Container/Presentational Separation

**Container Components** (Smart Components)
- Handle data fetching with React Query
- Manage local state (filters, pagination)
- Handle user interactions and callbacks
- Located in: `app/(protected)/[feature]/components/*-container.tsx`

**Presentational Components** (Dumb Components)
- Receive data via props
- Focus on UI rendering
- No direct API calls or complex state
- Located in: `app/(protected)/[feature]/components/*-header.tsx`, `*-table.tsx`

**Example:**
```typescript
// Container: visit-management-container.tsx
export function VisitManagementContainer() {
  const [searchFilter, setSearchFilter] = useQueryState("searchFilter")
  const { visits, isLoading } = useGetAllVisitQuery({ searchTerms: searchFilter })

  return (
    <>
      <VisitManagementHeader stats={...} />
      <VisitManagementTable visits={visits} isLoading={isLoading} />
    </>
  )
}

// Presentational: visit-management-table.tsx
export function VisitManagementTable({ visits, isLoading }: Props) {
  // Only rendering logic, no data fetching
  return <Table>...</Table>
}
```

### Pattern 2: Feature-Based Organization

Each feature is self-contained with its components, types, and logic:

```
app/(protected)/masters/treatments/
├── page.tsx                          # Main page (entry point)
├── create/
│   ├── page.tsx                      # Create page wrapper
│   └── components/
│       └── add-treatment-form.tsx    # Form component
├── edit/[id]/
│   └── page.tsx                      # Edit page (reuses form)
└── components/
    ├── treatment-management-container.tsx
    ├── treatment-management-header.tsx
    ├── table/
    │   ├── treatment-management-table.tsx
    │   └── ...
    ├── data.ts                       # Column definitions
    └── stores/                       # Feature-specific stores
        └── useTreatmentManagementStore.ts
```

### Pattern 3: Layered State Management

Different state types use different tools:

```
┌─────────────────────────────────────┐
│ URL State (nuqs)                    │ → Shareable, bookmarkable
│ - Search filters                    │   (search, pagination, filters)
│ - Pagination                        │
│ - Selected department               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ React Query Cache                   │ → Server state
│ - API data (patients, visits)       │   (cached, auto-refresh)
│ - Prefetched data                   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Zustand Stores                      │ → Global client state
│ - Auth token (persisted)            │   (persisted, accessible anywhere)
│ - Column visibility                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ React Hook Form                     │ → Form state
│ - Form field values                 │   (validation, dirty tracking)
│ - Validation errors                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Local useState                      │ → Ephemeral component state
│ - Modal open/closed                 │   (doesn't need persistence)
│ - Dropdown expanded                 │
└─────────────────────────────────────┘
```

## Decision Trees

### When to Use Server vs Client Components?

```
Is the component making API calls or using hooks?
│
├─ Yes → Use "use client" directive
│   └─ Examples: Forms, tables, containers with queries
│
└─ No → Can it stay server-side?
    │
    ├─ Yes (just rendering static content) → Keep as Server Component
    │   └─ Examples: Page layouts, static headers
    │
    └─ No (needs interactivity) → Use "use client"
        └─ Examples: Buttons with onClick, forms
```

### Where to Put Component Files?

```
Is it a UI primitive (button, input, dialog)?
│
├─ Yes → components/ui/
│   └─ Shadcn UI components
│
└─ No → Is it reusable across features?
    │
    ├─ Yes → components/
    │   └─ Examples: PageHeader, DeleteConfirmationModal
    │
    └─ No (feature-specific) → app/(protected)/[feature]/components/
        └─ Examples: TreatmentManagementTable, AddTreatmentForm
```

### Where to Put Types?

```
Is it an API response type?
│
├─ Yes → types/[domain].ts
│   └─ Examples: PatientResponse, VisitDetails
│
└─ No → Is it shared across features?
    │
    ├─ Yes → types/[domain].ts
    │   └─ Examples: VisitDiagnosis, VisitProcedure
    │
    └─ No (component-specific) → Define inline or in same file
        └─ Examples: Component prop types
```

## Anti-Patterns

### ❌ Direct Axios Calls in Components

```typescript
// ❌ DON'T
function PatientList() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    api.get("/api/v1/patient").then(res => setPatients(res.data))
  }, [])
}
```

```typescript
// ✅ DO - Use React Query
function PatientList() {
  const { patients, isLoading } = useGetAllPatientsQuery({ pageNumber: 1 })
}
```

**Why?** React Query provides caching, deduplication, refetching, loading states, and error handling automatically.

### ❌ Mixing Data Fetching with Presentation

```typescript
// ❌ DON'T - Table component doing its own fetching
function PatientTable() {
  const { patients } = useGetAllPatientsQuery() // Data fetching in table

  return (
    <Table>
      {patients.map(patient => <TableRow key={patient.id}>...)</TableRow>}
    </Table>
  )
}
```

```typescript
// ✅ DO - Container fetches, table receives props
function PatientContainer() {
  const { patients } = useGetAllPatientsQuery()
  return <PatientTable patients={patients} />
}

function PatientTable({ patients }: { patients: Patient[] }) {
  return <Table>...</Table>
}
```

**Why?** Separation of concerns makes components more testable and reusable.

### ❌ Using Interface Instead of Type

```typescript
// ❌ DON'T
interface Patient {
  id: string
  name: string
}
```

```typescript
// ✅ DO
type Patient = {
  id: string
  name: string
}
```

**Why?** Project ESLint rules enforce `type` over `interface` for consistency.

### ❌ Storing Server State in useState

```typescript
// ❌ DON'T
function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    fetchPatients().then(setPatients)
  }, [])
}
```

```typescript
// ✅ DO
function PatientList() {
  const { patients } = useGetAllPatientsQuery({ pageNumber: 1 })
}
```

**Why?** React Query handles caching, background updates, and stale data automatically.

## Related Specifications

- [Component Patterns](./component-patterns.md) - Detailed component architecture
- [API Integration](./api-integration.md) - React Query patterns
- [State Management](./state-management.md) - Zustand and URL state
- [Page & Routing](./page-routing.md) - Next.js App Router patterns

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Container/Presentational | `app/(protected)/patients/visit-list/components/visit-management-container.tsx` |
| Feature Organization | `app/(protected)/masters/treatments/` directory |
| Zustand Store | `stores/useAuthStore.ts` |
| React Query Hook | `queries/visit/useGetAllVisitQuery.ts` |
| Axios Configuration | `lib/axios.ts` |
| Protected Layout | `app/(protected)/layout.tsx` |
