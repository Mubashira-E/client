# Page & Routing Specification

## Overview

This application uses Next.js 15 App Router with file-based routing. Routes are organized using route groups, with protected routes requiring authentication.

## Directory Structure Patterns

### Pattern 1: Protected Routes

All authenticated routes are under `app/(protected)/`:

```
app/
├── (protected)/              # Route group - requires auth
│   ├── layout.tsx            # Protected layout (sidebar, header)
│   ├── patients/
│   │   ├── patient-list/
│   │   │   └── page.tsx
│   │   └── visit-list/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── view/
│   │               └── page.tsx
│   └── masters/
│       ├── treatments/
│       │   ├── page.tsx      # List page
│       │   ├── create/
│       │   │   └── page.tsx
│       │   └── edit/[id]/
│       │       └── page.tsx
│       └── ...
├── login/                    # Public route
│   └── page.tsx
└── layout.tsx                # Root layout
```

## Page Component Patterns

### Pattern 1: List Page

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
  title: "Visit Management | EMR",
  description: "Manage patient visits and appointments",
};

export default function VisitListPage() {
  return <VisitManagementContainer />;
}
```

### Pattern 2: Create Page

**Example:** `app/(protected)/masters/treatments/create/page.tsx:1`

```typescript
"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { AddTreatmentForm } from "./components/add-treatment-form";

export default function CreateTreatmentPage() {
  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link href="/masters/treatments">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="size-4" />
          Back to Treatments
        </Button>
      </Link>

      {/* Page header */}
      <PageHeader
        title="Create Treatment"
        description="Add a new treatment to the system"
      />

      {/* Form component */}
      <AddTreatmentForm />
    </div>
  );
}
```

### Pattern 3: Edit Page (Dynamic Route)

**Example:** `app/(protected)/masters/treatments/edit/[id]/page.tsx:1`

```typescript
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useGetTreatmentByIdQuery } from "@/queries/masters/treatments/useGetTreatmentByIdQuery";
import { AddTreatmentForm } from "../../create/components/add-treatment-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTreatmentPage() {
  const params = useParams();
  const treatmentId = params.id as string;

  const { treatment, isLoading } = useGetTreatmentByIdQuery(treatmentId);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Edit Treatment"
        description="Update treatment information"
      />
      <AddTreatmentForm
        initialData={treatment}
        treatmentId={treatmentId}
        isEditMode
      />
    </div>
  );
}
```

### Pattern 4: Detail/View Page

**Example:** `app/(protected)/patients/visit-list/[id]/view/page.tsx`

```typescript
"use client";

import { useParams } from "next/navigation";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";
import { VisitDetails } from "./components/visit-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

export default function ViewVisitPage() {
  const params = useParams();
  const visitId = params.id as string;

  const { visit, isLoading, error } = useGetVisitByIdQuery(visitId);

  if (isLoading) return <Skeleton className="h-screen" />;

  if (error) {
    return (
      <Alert variant="destructive">
        Failed to load visit details
      </Alert>
    );
  }

  return <VisitDetails visit={visit} />;
}
```

## Layout Patterns

### Pattern 1: Root Layout

**Example:** `app/layout.tsx:1`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "./providers";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayurvedic EMR",
  description: "Electronic Medical Records System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: Protected Layout with Sidebar

**Example:** `app/(protected)/layout.tsx:1`

```typescript
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { StickyHeader } from "./components/sticky-header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 bg-gray-50">
        <StickyHeader />
        <section className="max-w-screen-4xl px-4 py-5">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
}
```

## Navigation Patterns

### Pattern 1: Programmatic Navigation (useRouter)

```typescript
import { useRouter } from "next/navigation";

function CreateForm() {
  const router = useRouter();

  async function handleSubmit(data) {
    await createMutation.mutateAsync(data);
    router.push("/masters/treatments"); // Navigate after success
  }

  function handleCancel() {
    router.back(); // Go back to previous page
  }
}
```

### Pattern 2: Link Component

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

<Link href="/patients/patient-list">
  <Button variant="outline">View Patients</Button>
</Link>
```

### Pattern 3: Back Navigation

```typescript
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

<Link href="/masters/treatments">
  <Button variant="ghost" size="sm">
    <ChevronLeft className="size-4" />
    Back to Treatments
  </Button>
</Link>
```

## Loading States

### Pattern 1: Page-Level Loading

**File:** `app/(protected)/masters/treatments/loading.tsx`

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export default function TreatmentsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

### Pattern 2: Component-Level Loading

```typescript
const { data, isLoading } = useQuery(...);

if (isLoading) {
  return <Skeleton className="h-96" />;
}

return <Content data={data} />;
```

## Dynamic Routes

### Accessing Parameters

```typescript
import { useParams, useSearchParams } from "next/navigation";

function EditPage() {
  // Path params: /edit/[id]
  const params = useParams();
  const id = params.id as string;

  // Query params: /edit/123?mode=view
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
}
```

## Decision Trees

### When to Use useRouter vs Link?

```
Is navigation triggered by user action (form submit, button click)?
│
├─ Yes → Use useRouter().push()
│   └─ Examples: After form submission, programmatic navigation
│
└─ No → Is it a clickable link?
    └─ Yes → Use <Link> component
        └─ Examples: Navigation links, back buttons
```

### Page vs Layout?

```
Does this UI wrap multiple pages?
│
├─ Yes → Use layout.tsx
│   └─ Examples: Sidebar, header, authentication wrapper
│
└─ No → Is it a single route?
    └─ Yes → Use page.tsx
```

### Client vs Server Component for Pages?

```
Does the page need client-side hooks (useState, useQuery, useRouter)?
│
├─ Yes → Add "use client" directive
│   └─ Examples: Pages with data fetching, forms, interactive elements
│
└─ No → Keep as Server Component
    └─ Examples: Static pages, simple layouts
```

## Anti-Patterns

### ❌ Using Client Component for Simple Pages

```typescript
// ❌ DON'T - Unnecessary client component
"use client";

export default function AboutPage() {
  return <div>About Us</div>;
}
```

```typescript
// ✅ DO - Server component for static content
export default function AboutPage() {
  return <div>About Us</div>;
}
```

### ❌ Fetching Data in Page Component

```typescript
// ❌ DON'T
export default function PatientsPage() {
  const { patients } = useGetAllPatientsQuery({});

  return <PatientTable patients={patients} />;
}
```

```typescript
// ✅ DO - Delegate to container
export default function PatientsPage() {
  return <PatientManagementContainer />;
}
```

### ❌ Not Handling Loading States

```typescript
// ❌ DON'T
const { data } = useQuery(...);
return <Table data={data} />; // Error if data is undefined
```

```typescript
// ✅ DO
const { data, isLoading } = useQuery(...);

if (isLoading) return <Skeleton />;
return <Table data={data} />;
```

## Route Organization Best Practices

1. **Feature-based organization**: Group related pages together
2. **Route groups**: Use `(protected)` for auth-required routes
3. **Colocated components**: Keep page-specific components in `components/` folder next to page
4. **Consistent naming**: Use descriptive folder names matching URL paths

## Related Specifications

- [Component Patterns](./component-patterns.md) - Page component structure
- [Architecture](./architecture.md) - Overall routing architecture

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| List Page | `app/(protected)/patients/visit-list/page.tsx` |
| Create Page | `app/(protected)/masters/treatments/create/page.tsx` |
| Edit Page | `app/(protected)/masters/treatments/edit/[id]/page.tsx` |
| Protected Layout | `app/(protected)/layout.tsx` |
| Root Layout | `app/layout.tsx` |
