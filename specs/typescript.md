# TypeScript Specification

## Overview

This application uses TypeScript with strict mode for type safety. All types are defined explicitly, with a preference for `type` over `interface`.

## Type Naming Conventions

### API Response Types

```typescript
// Basic entity
type Treatment = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  price: number;
};

// API response (from list endpoints)
type TreatmentManagementResponse = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  price: number;
  createdDate?: string;
  updatedDate?: string;
};

// Detailed/nested response
type TreatmentDetails = {
  treatmentId: string;
  treatmentName: string;
  rooms: Room[];
  clinicians: Clinician[];
};

// API list response wrapper
type TreatmentListApiResponse = {
  data: {
    items: TreatmentManagementResponse[];
    pageCount: number;
    totalCount: number;
  };
};
```

**Naming Pattern:**
- `[Entity]` - Basic type
- `[Entity]ManagementResponse` - List item from management endpoints
- `[Entity]Details` - Detailed/nested response
- `[Entity]ListApiResponse` - Wrapper for paginated lists
- `[Entity]Request` - Request payload for mutations

### Component Props

```typescript
// Explicit Props type
type ButtonProps = {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ variant = "default", size = "default", isLoading, children, onClick }: ButtonProps) {
  // Implementation
}
```

**Alternative (for extending HTML elements):**

```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  isLoading?: boolean;
};
```

### Form Types (from Zod)

```typescript
import { z } from "zod";

// Define Zod schema
const createTreatmentSchema = z.object({
  treatmentName: z.string().min(2),
  treatmentCode: z.string().min(1),
  price: z.number().min(0),
});

// Infer TypeScript type from schema
type TreatmentRequest = z.infer<typeof createTreatmentSchema>;

// Use in component
const form = useForm<TreatmentRequest>({
  resolver: zodResolver(createTreatmentSchema),
});
```

## Type vs Interface

### Use `type` (Preferred)

```typescript
// ✅ DO - Use type
type Patient = {
  patientId: string;
  name: string;
  age: number;
};

type ButtonVariant = "default" | "outline" | "ghost";
```

### Avoid `interface` (Enforced by ESLint)

```typescript
// ❌ DON'T - ESLint will error
interface Patient {
  patientId: string;
  name: string;
}
```

**Why?** Consistency across codebase. ESLint rule enforces this.

## Common Type Patterns

### Union Types

```typescript
type Status = "active" | "inactive" | "pending";
type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
```

### Optional Properties

```typescript
type Patient = {
  patientId: string;
  name: string;
  email?: string;          // Optional
  phone?: string | null;   // Optional or null
};
```

### Generic Types

```typescript
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Usage
type PatientResponse = ApiResponse<Patient>;
```

### Array Types

```typescript
type Patients = Patient[];
// Or
type Patients = Array<Patient>;
```

### Function Types

```typescript
type OnSubmit = (data: FormData) => void;
type OnSubmitAsync = (data: FormData) => Promise<void>;

// Component props
type FormProps = {
  onSubmit: OnSubmit;
  onCancel: () => void;
};
```

### React Types

```typescript
// Component props with children
type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

// Event handlers
type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// Refs
type InputRef = React.RefObject<HTMLInputElement>;
```

## Type Location

### Where to Define Types?

```
Is it an API response type?
│
├─ Yes → types/[domain].ts
│   └─ Example: types/patient.ts, types/visit.ts
│
└─ No → Is it shared across features?
    │
    ├─ Yes → types/[domain].ts
    │
    └─ No → Define inline in component file
        └─ Example: Component-specific Props types
```

### Type File Structure

**Example:** `types/treatment.ts`

```typescript
// API Response Types
export type TreatmentManagementResponse = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  price: number;
  duration?: number;
  createdDate?: string;
  updatedDate?: string;
};

export type TreatmentDetails = {
  treatmentId: string;
  treatmentName: string;
  treatmentCode: string;
  price: number;
  duration?: number;
  rooms: TreatmentRoom[];
  clinicians: TreatmentClinician[];
};

// Request Types
export type TreatmentRequest = {
  treatmentName: string;
  treatmentCode: string;
  price: number;
  duration?: number;
};

// API List Response Wrapper
export type TreatmentListApiResponse = {
  data: {
    items: TreatmentManagementResponse[];
    pageCount: number;
    totalCount: number;
  };
};

// Related Types
export type TreatmentRoom = {
  roomId: string;
  roomName: string;
};

export type TreatmentClinician = {
  clinicianId: string;
  clinicianName: string;
};
```

## Type Inference

### Zod Schema Inference

```typescript
// Define schema
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// Infer type
type FormData = z.infer<typeof schema>;
// Result: { name: string; age: number }
```

### Function Return Type Inference

```typescript
// Let TypeScript infer return type
function getPatient(id: string) {
  return api.get<Patient>(`/api/v1/patient/${id}`);
}
// Return type: Promise<AxiosResponse<Patient>>
```

## Utility Types

### Pick and Omit

```typescript
type Patient = {
  patientId: string;
  name: string;
  email: string;
  phone: string;
};

// Pick specific fields
type PatientPreview = Pick<Patient, "patientId" | "name">;
// Result: { patientId: string; name: string }

// Omit specific fields
type PatientWithoutId = Omit<Patient, "patientId">;
// Result: { name: string; email: string; phone: string }
```

### Partial and Required

```typescript
// All properties optional
type PartialPatient = Partial<Patient>;

// All properties required
type RequiredPatient = Required<Patient>;
```

### Record

```typescript
// Object with string keys and Patient values
type PatientMap = Record<string, Patient>;
```

## Anti-Patterns

### ❌ Using `any`

```typescript
// ❌ DON'T
function handleData(data: any) {
  return data.value;
}
```

```typescript
// ✅ DO
function handleData(data: Patient) {
  return data.patientId;
}

// Or use unknown if type truly unknown
function handleData(data: unknown) {
  if (isPatient(data)) {
    return data.patientId;
  }
}
```

### ❌ Using `interface`

```typescript
// ❌ DON'T - ESLint will error
interface Patient {
  name: string;
}
```

```typescript
// ✅ DO
type Patient = {
  name: string;
};
```

### ❌ Duplicate Type Definitions

```typescript
// ❌ DON'T - Define same type in multiple files
// In component1.tsx
type Patient = { name: string };

// In component2.tsx
type Patient = { name: string };
```

```typescript
// ✅ DO - Define once in types/patient.ts
// In types/patient.ts
export type Patient = { name: string };

// Import in components
import type { Patient } from "@/types/patient";
```

### ❌ Not Using Type Inference

```typescript
// ❌ DON'T - Redundant type annotation
const name: string = "John";
const numbers: number[] = [1, 2, 3];
```

```typescript
// ✅ DO - Let TypeScript infer
const name = "John";
const numbers = [1, 2, 3];
```

## TypeScript Configuration

**Key tsconfig.json settings:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "lib": ["ES2023"],
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Related Specifications

- [API Integration](./api-integration.md) - API response types
- [Form Patterns](./form-patterns.md) - Zod schema types

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| API Response Types | `types/visit.ts` |
| Request Types | `types/treatment.ts` |
| Component Props | `components/ui/button.tsx` |
| Zod Inference | `queries/masters/treatments/useCreateTreatmentMutationQuery.ts` |
