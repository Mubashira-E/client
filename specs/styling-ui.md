# Styling & UI Specification

## Overview

This application uses Tailwind CSS 4 with Shadcn UI components built on Radix UI primitives. Styling follows a utility-first approach with consistent design tokens and component variants.

## Core Tools

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Radix UI components with custom styling
- **Lucide React** - Icon library
- **CVA (class-variance-authority)** - Variant management
- **cn() utility** - Class name merging from `lib/utils.ts`

## Tailwind Patterns

### Spacing & Layout

```typescript
// Common spacing patterns
className="space-y-4"         // Vertical spacing between children
className="gap-2"             // Gap in flex/grid (8px)
className="gap-4"             // Gap in flex/grid (16px)
className="px-4 py-2"         // Padding horizontal & vertical
className="p-4"               // Padding all sides

// Flexbox layouts
className="flex items-center justify-between"
className="flex flex-col gap-4"
className="flex flex-row items-start"

// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 gap-4"
className="grid grid-cols-2 lg:grid-cols-3 gap-6"
```

### Responsive Design

```typescript
// Mobile-first breakpoints
className="w-full md:w-1/2 lg:w-1/3"  // Width responsive
className="flex-col sm:flex-row"      // Direction responsive
className="hidden lg:flex"            // Hide on mobile, show on large
className="text-sm md:text-base"     // Font size responsive

// Breakpoints:
// sm: 640px
// md: 768px  (MOBILE_BREAKPOINT)
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### Colors

```typescript
// Background
className="bg-white"
className="bg-gray-50"        // Page background
className="bg-gray-100"
className="bg-primary"        // Primary brand color
className="bg-destructive"    // Red for errors/delete

// Text
className="text-gray-800"     // Primary text
className="text-gray-600"     // Secondary text
className="text-muted-foreground"
className="text-red-500"      // Error/required
className="text-primary"

// Borders
className="border border-gray-200"
className="border-primary"
```

### Typography

```typescript
className="text-xl font-medium"       // Page titles
className="text-sm text-gray-600"     // Descriptions
className="font-semibold"
className="font-medium"
className="text-xs"                   // Small text
```

### Interactive States

```typescript
// Hover
className="hover:bg-gray-100"
className="hover:text-primary"

// Focus
className="focus-visible:outline-none focus-visible:ring-2"

// Disabled
className="disabled:opacity-50 disabled:pointer-events-none"

// Active
className="aria-selected:bg-primary"
```

## Shadcn UI Component Usage

### Button Variants

```typescript
import { Button } from "@/components/ui/button";

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link Style</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Loading state
<Button isLoading={isPending}>Submit</Button>
```

### Card Component

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input Fields

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email..."
  />
</div>
```

### Select Dropdown

```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";

<Select onValueChange={setValue} defaultValue={value}>
  <SelectTrigger>
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Dialog/Modal

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

## Icon Patterns

```typescript
import { AlertCircle, Check, Edit, Trash2, MoreHorizontal } from "lucide-react";

// Consistent sizing
<AlertCircle className="size-4" />     // 16px × 16px
<Check className="size-5" />           // 20px × 20px
<Edit className="size-6" />            // 24px × 24px

// With text
<Button>
  <Check className="size-4" />
  Save
</Button>

// Standalone
<Edit className="size-4 text-gray-600 hover:text-primary cursor-pointer" />
```

## Layout Patterns

### Page Layout

```typescript
<div className="space-y-4">
  <PageHeader title="Page Title" description="Page description" />
  <div className="space-y-4">
    {/* Page content */}
  </div>
</div>
```

### Form Layout (2-column grid)

```typescript
<Card>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField name="firstName" />
      <FormField name="lastName" />
    </div>
  </CardContent>
</Card>
```

### Action Buttons

```typescript
<div className="flex justify-end gap-2">
  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
  <Button type="submit">Save</Button>
</div>
```

## Decision Trees

### Which Button Variant?

```
Is this the primary action?
│
├─ Yes → variant="default"
│
└─ No → Is it destructive (delete)?
    │
    ├─ Yes → variant="destructive"
    │
    └─ No → Is it secondary?
        │
        ├─ Yes → variant="outline"
        │
        └─ No → Is it tertiary/minimal?
            └─ Yes → variant="ghost"
```

### Spacing Choice?

```
What's the relationship between elements?
│
├─ Tightly related → gap-2 (8px)
├─ Related → gap-4 (16px)
├─ Sections → gap-6 (24px)
└─ Major sections → gap-8 (32px)
```

## Anti-Patterns

### ❌ Inline Styles

```typescript
// ❌ DON'T
<div style={{ padding: "16px", backgroundColor: "#fff" }}>
```

```typescript
// ✅ DO
<div className="p-4 bg-white">
```

### ❌ Custom CSS Files

```typescript
// ❌ DON'T - Create separate CSS files
import "./custom.css";
```

```typescript
// ✅ DO - Use Tailwind utilities
<div className="flex items-center gap-2">
```

### ❌ Overriding Shadcn Component Styles

```typescript
// ❌ DON'T
<Button className="bg-blue-500 hover:bg-blue-600">
```

```typescript
// ✅ DO - Use or extend variants
<Button variant="default">

// Or modify button.tsx to add custom variant
```

## Related Specifications

- [Component Patterns](./component-patterns.md) - Component structure
- [Form Patterns](./form-patterns.md) - Form field styling

## Real Examples from Codebase

| Pattern | Example File |
|---------|-------------|
| Button Usage | `app/(protected)/masters/treatments/components/treatment-management-header.tsx` |
| Card Layout | `app/(protected)/masters/treatments/create/components/add-treatment-form.tsx` |
| Responsive Grid | Form layouts throughout the app |
| Shadcn Components | `components/ui/` directory |
