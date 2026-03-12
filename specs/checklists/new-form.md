# Checklist: Creating a New Form

Use this checklist when adding a form with React Hook Form and Zod validation.

## 1. Define Zod Schema

- [ ] Create or locate mutation hook file (e.g., `queries/masters/treatments/useCreateTreatmentMutationQuery.ts`)
- [ ] Define Zod schema with validation rules
- [ ] Add error messages to each validation rule
- [ ] Export schema for use in form component

**Example:**

```typescript
import { z } from "zod";

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
```

## 2. Define TypeScript Types

- [ ] Infer form type from Zod schema: `type FormValues = z.infer<typeof schema>`
- [ ] Define request type if different from form values
- [ ] Add types to `types/[domain].ts` if shared

## 3. Set Up Form Component

- [ ] Create form component file (e.g., `add-treatment-form.tsx`)
- [ ] Add `"use client"` directive
- [ ] Import necessary components and hooks
- [ ] Define component props (initialData?, isEditMode?)

## 4. Initialize React Hook Form

- [ ] Import `useForm` from react-hook-form
- [ ] Import `zodResolver` from @hookform/resolvers/zod
- [ ] Set up form with resolver and default values

**Example:**

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(createTreatmentSchema),
  defaultValues: initialData || {
    treatmentName: "",
    treatmentCode: "",
    price: 0,
    duration: 0,
  },
});
```

## 5. Set Up Mutation

- [ ] Import mutation hook
- [ ] Call mutation hook
- [ ] Extract `mutateAsync` and `isPending`
- [ ] Add onSuccess and onError callbacks (optional)

## 6. Create Submit Handler

- [ ] Define `onSubmit` function with form data parameter
- [ ] Call mutation with data
- [ ] Handle success (toast, navigation)
- [ ] Handle error (toast)

**Example:**

```typescript
async function onSubmit(data: FormValues) {
  try {
    await mutateAsync(data);
    toast.success("Treatment created successfully");
    router.push("/masters/treatments");
  } catch (error) {
    toast.error("Error creating treatment");
  }
}
```

## 7. Create Form Structure

- [ ] Wrap with `<Form {...form}>`
- [ ] Create `<form>` with `onSubmit={form.handleSubmit(onSubmit)}`
- [ ] Add `className="space-y-6"` for spacing

## 8. Add Form Sections (Cards)

- [ ] Wrap sections in `<Card>` components
- [ ] Add `<CardHeader>` with title and description
- [ ] Add `<CardContent className="space-y-4">`

## 9. Add Form Fields

For each field:

### Text Input

- [ ] Use `<FormField>` with control and name
- [ ] Add render prop with `field` parameter
- [ ] Wrap in `<FormItem>`
- [ ] Add `<FormLabel>` with required indicator if needed
- [ ] Add `<FormControl>` wrapping `<Input>`
- [ ] Spread field props: `{...field}`
- [ ] Add `<FormMessage />` for errors

**Template:**

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
      <FormMessage />
    </FormItem>
  )}
/>
```

### Number Input

- [ ] Add `type="number"` to Input
- [ ] Add `onChange` handler to convert to number

**Example:**

```typescript
<Input
  type="number"
  {...field}
  onChange={(e) => field.onChange(Number(e.target.value))}
/>
```

### Select Dropdown

- [ ] Use `<Select>` with onValueChange and defaultValue
- [ ] Add `<SelectTrigger>` and `<SelectValue>`
- [ ] Add `<SelectContent>` with `<SelectItem>` options

### Textarea

- [ ] Use `<Textarea>` instead of `<Input>`
- [ ] Add `className="min-h-[100px]"` for minimum height

### Checkbox

- [ ] Use `<Checkbox>` with checked and onCheckedChange
- [ ] Use flex layout for label and checkbox

## 10. Add Grid Layout (if multiple columns)

- [ ] Wrap related fields in `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">`

## 11. Add Action Buttons

- [ ] Create button container: `<div className="flex justify-end gap-2">`
- [ ] Add Cancel button with `variant="outline"` and `onClick={() => router.back()}`
- [ ] Add Submit button with `type="submit"`, `isLoading={isPending}`, `disabled={isPending}`
- [ ] Set button text based on isEditMode

**Example:**

```typescript
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
```

## 12. Make Form Dual-Purpose (Create & Edit)

- [ ] Accept `initialData` prop
- [ ] Accept `isEditMode` prop
- [ ] Accept entity `id` prop for edit
- [ ] Use different mutation based on mode
- [ ] Set default values from initialData

**Example:**

```typescript
type Props = {
  initialData?: TreatmentRequest;
  treatmentId?: string;
  isEditMode?: boolean;
};

const createMutation = useCreateTreatmentMutationQuery();
const updateMutation = useUpdateTreatmentMutationQuery();

async function onSubmit(data: FormValues) {
  if (isEditMode && treatmentId) {
    await updateMutation.mutateAsync({ id: treatmentId, data });
  } else {
    await createMutation.mutateAsync(data);
  }
}
```

## 13. Add Error Handling

- [ ] Form-level errors: Add Alert component above form if needed
- [ ] Field-level errors: `<FormMessage />` handles automatically
- [ ] API errors: Show toast in onError callback

## 14. Testing

- [ ] Test form renders correctly
- [ ] Test validation errors show for invalid input
- [ ] Test successful submission
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test cancel button

**See:** [Testing Spec](../testing.md)

## 15. Final Checks

- [ ] All required fields have red asterisk (*)
- [ ] All fields have proper validation
- [ ] Submit button shows loading state
- [ ] Cancel button navigates back
- [ ] Success toast shows on submit
- [ ] Error toast shows on failure
- [ ] Form works for both create and edit modes
- [ ] TypeScript types are correct
- [ ] No console errors

## Related Checklists

- [New API Endpoint Checklist](./new-api-endpoint.md)
- [New CRUD Feature Checklist](./new-crud-feature.md)

## References

- [Form Patterns Spec](../form-patterns.md)
- [Error Handling Spec](../error-handling.md)
- Example: `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx`
