# Form Patterns Specification

## Overview

This document defines patterns for building forms using React Hook Form with Zod validation. Forms are a critical part of the EMR application, handling data entry for patients, visits, treatments, and master data.

## Core Stack

- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation
- **@hookform/resolvers/zod** - Integration between React Hook Form and Zod
- **Shadcn UI Form Components** - Pre-styled form components

## Standard Form Pattern

### Complete Form Example

**Example:** `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx:18`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateTreatmentMutationQuery, createTreatmentSchema } from "@/queries/masters/treatments/useCreateTreatmentMutationQuery";
import type { TreatmentRequest } from "@/types/treatment";

// Use schema from mutation hook
type FormValues = z.infer<typeof createTreatmentSchema>;

type Props = {
  initialData?: TreatmentRequest;
  treatmentId?: string;
  isEditMode?: boolean;
};

export function AddTreatmentForm({ initialData, treatmentId, isEditMode }: Props) {
  const router = useRouter();

  // Initialize form with Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: initialData || {
      treatmentName: "",
      treatmentCode: "",
      price: 0,
      duration: 0,
    },
  });

  // Mutation hook
  const { mutateAsync, isPending } = useCreateTreatmentMutationQuery();

  // Submit handler
  async function onSubmit(data: FormValues) {
    try {
      await mutateAsync(data);
      toast.success("Treatment created successfully", {
        description: `Treatment "${data.treatmentName}" has been created.`,
      });
      router.push("/masters/treatments");
    } catch (error) {
      toast.error("Error creating treatment", {
        description: error.response?.data?.message || "An error occurred",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Treatment Information</CardTitle>
            <CardDescription>Enter the details of the treatment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Grid layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Input Field */}
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

              <FormField
                control={form.control}
                name="treatmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Treatment Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Abhyanga Massage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number Input Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} disabled={isPending}>
            {isEditMode ? "Update" : "Create"} Treatment
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## Form Field Patterns

### Pattern 1: Text Input

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
        <Input placeholder="Enter value..." {...field} />
      </FormControl>
      <FormDescription>Optional helper text</FormDescription>
      <FormMessage /> {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

### Pattern 2: Number Input

```typescript
<FormField
  control={form.control}
  name="price"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Price</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Key Point:** Convert string to number with `Number(e.target.value)`.

### Pattern 3: Select/Dropdown

```typescript
<FormField
  control={form.control}
  name="department"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Department</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="cardiology">Cardiology</SelectItem>
          <SelectItem value="neurology">Neurology</SelectItem>
          <SelectItem value="pediatrics">Pediatrics</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pattern 4: Multi-Select

```typescript
<FormField
  control={form.control}
  name="languages"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Languages</FormLabel>
      <FormControl>
        <MultiSelect
          options={languageOptions}
          selected={field.value || []}
          onChange={field.onChange}
          placeholder="Select languages..."
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pattern 5: Textarea

```typescript
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Enter description..."
          className="min-h-[100px]"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pattern 6: Checkbox

```typescript
<FormField
  control={form.control}
  name="isActive"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
        <FormDescription>
          Enable this treatment for scheduling
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
```

### Pattern 7: Date Picker

```typescript
<FormField
  control={form.control}
  name="dateOfBirth"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Date of Birth</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? format(field.value, "PPP") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Validation Patterns

### Zod Schema Examples

```typescript
import { z } from "zod";

// Required string with minimum length
const schema = z.object({
  name: z.string().trim().min(2, {
    message: "Name must be at least 2 characters",
  }),

  // Required email
  email: z.email({
    message: "Please enter a valid email address",
  }),

  // Optional string
  notes: z.string().optional(),

  // Number with min/max
  age: z.number().min(0).max(150, {
    message: "Age must be between 0 and 150",
  }),

  // Positive number
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),

  // Boolean
  isActive: z.boolean().default(true),

  // Enum/Select
  status: z.enum(["active", "inactive", "pending"], {
    message: "Please select a valid status",
  }),

  // Array
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required",
  }),

  // Conditional validation
  password: z.string().min(8).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Date validation
const dateSchema = z.object({
  startDate: z.date({
    error: "Start date is required",
  }),
  endDate: z.date().optional(),
}).refine((data) => {
  if (data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});
```

## Dual-Purpose Forms (Create & Edit)

### Pattern: Single Form for Create and Edit

```typescript
type Props = {
  initialData?: TreatmentRequest;
  treatmentId?: string;
  isEditMode?: boolean;
};

export function TreatmentForm({ initialData, treatmentId, isEditMode }: Props) {
  const router = useRouter();

  const form = useForm<TreatmentRequest>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: initialData || {
      treatmentName: "",
      treatmentCode: "",
      price: 0,
    },
  });

  // Use different mutations based on mode
  const createMutation = useCreateTreatmentMutationQuery();
  const updateMutation = useUpdateTreatmentMutationQuery();

  async function onSubmit(data: TreatmentRequest) {
    if (isEditMode && treatmentId) {
      await updateMutation.mutateAsync({ id: treatmentId, data });
      toast.success("Treatment updated");
    } else {
      await createMutation.mutateAsync(data);
      toast.success("Treatment created");
    }
    router.push("/masters/treatments");
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <Button type="submit" isLoading={isPending}>
          {isEditMode ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
```

**Usage for Create:**

```typescript
// In create/page.tsx
<TreatmentForm />
```

**Usage for Edit:**

```typescript
// In edit/[id]/page.tsx
const { treatment, isLoading } = useGetTreatmentByIdQuery(id);

if (isLoading) return <Skeleton />;

return (
  <TreatmentForm
    initialData={treatment}
    treatmentId={id}
    isEditMode
  />
);
```

## Form Layout Patterns

### Pattern 1: Single Column Layout

For simple forms with few fields:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <FormField name="username" {...} />
    <FormField name="password" {...} />
  </CardContent>
  <CardFooter>
    <Button type="submit">Login</Button>
  </CardFooter>
</Card>
```

### Pattern 2: Two-Column Grid Layout

For forms with many fields:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Patient Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField name="firstName" {...} />
      <FormField name="lastName" {...} />
      <FormField name="email" {...} />
      <FormField name="phone" {...} />
    </div>
  </CardContent>
</Card>
```

### Pattern 3: Sectioned Form

For complex forms with logical sections:

```typescript
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  {/* Section 1 */}
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Personal fields */}
    </CardContent>
  </Card>

  {/* Section 2 */}
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Contact fields */}
    </CardContent>
  </Card>

  {/* Action buttons outside cards */}
  <div className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>
```

## Decision Trees

### When to Use React Hook Form vs Manual State?

```
Is the form complex (5+ fields) or needs validation?
│
├─ Yes → Use React Hook Form + Zod
│   └─ Benefits: Validation, error handling, type safety
│
└─ No → Is it a simple form (2-3 fields, no validation)?
    │
    ├─ Yes → Can use manual state with useState
    │   └─ Example: Simple search form, filter form
    │
    └─ No (has validation) → Use React Hook Form + Zod
        └─ Even simple forms benefit from validation
```

### Required Field Indicator?

```
Is the field required in Zod schema?
│
├─ Yes → Add red asterisk to label
│   └─ <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
│
└─ No → No indicator
    └─ <FormLabel>Notes</FormLabel>
```

### Form Error Display Location?

```
Where to show errors?
│
├─ Field-level errors → <FormMessage />
│   └─ Validation errors for individual fields
│
├─ Form-level errors → Alert component above form
│   └─ Authentication errors, API errors
│
└─ Success messages → Toast notifications
    └─ "Created successfully", "Updated successfully"
```

## Anti-Patterns

### ❌ Manual Validation Logic

```typescript
// ❌ DON'T
const [errors, setErrors] = useState({});

function validateForm(data) {
  const newErrors = {};
  if (!data.name) newErrors.name = "Name is required";
  if (data.age < 0) newErrors.age = "Age must be positive";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
```

```typescript
// ✅ DO - Use Zod
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive"),
});

const form = useForm({ resolver: zodResolver(schema) });
```

### ❌ Not Using defaultValues

```typescript
// ❌ DON'T - Fields will be uncontrolled
const form = useForm();
```

```typescript
// ✅ DO
const form = useForm({
  defaultValues: {
    name: "",
    age: 0,
  },
});
```

### ❌ Directly Mutating Field Values

```typescript
// ❌ DON'T
<Input
  value={someValue}
  onChange={(e) => setSomeValue(e.target.value)}
/>
```

```typescript
// ✅ DO - Let React Hook Form manage state
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => <Input {...field} />}
/>
```

### ❌ Not Handling Number Inputs Properly

```typescript
// ❌ DON'T - Will be string
<Input type="number" {...field} />
```

```typescript
// ✅ DO - Convert to number
<Input
  type="number"
  {...field}
  onChange={(e) => field.onChange(Number(e.target.value))}
/>
```

### ❌ Duplicate Submit Handlers

```typescript
// ❌ DON'T
<form onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>
```

```typescript
// ✅ DO
<form onSubmit={form.handleSubmit(onSubmit)}>
```

## Related Specifications

- [Component Patterns](./component-patterns.md) - Form component structure
- [API Integration](./api-integration.md) - Using mutations with forms
- [Error Handling](./error-handling.md) - Error display patterns
- [Styling & UI](./styling-ui.md) - Form styling patterns

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Complete Form | `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx` |
| Login Form | `app/login/components/login-form.tsx` |
| Dual-Purpose Form | Treatment form (create/edit modes) |
| Zod Schema | `queries/masters/treatments/useCreateTreatmentMutationQuery.ts` |
