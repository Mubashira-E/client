# Development Specifications

This directory contains comprehensive development specifications for the Ayurvedic EMR Client application. These specifications are designed to enable **spec-driven development** - providing clear patterns, examples, and guidelines for building new features consistently.

## Quick Navigation

### Core Specifications

| Specification | Description | Key Topics |
|--------------|-------------|------------|
| [Architecture](./architecture.md) | System architecture, tech stack, and data flow | Next.js 15, React Query, Zustand, directory structure |
| [Component Patterns](./component-patterns.md) | Component composition and structure | Container/presentational, UI components, Shadcn integration |
| [API Integration](./api-integration.md) | React Query patterns for API calls | Queries, mutations, error handling, caching |
| [Form Patterns](./form-patterns.md) | Form implementation with validation | React Hook Form + Zod, layouts, error display |
| [State Management](./state-management.md) | Client state patterns | Zustand stores, URL state, when to use what |
| [Page & Routing](./page-routing.md) | Next.js App Router patterns | Page structure, layouts, protected routes |
| [Styling & UI](./styling-ui.md) | Tailwind and component styling | Utility classes, responsive design, Shadcn UI |
| [Table Patterns](./table-patterns.md) | Data table implementation | Filtering, sorting, pagination, column visibility |
| [Testing](./testing.md) | Testing strategies and patterns | Vitest, Testing Library, mocking |
| [TypeScript](./typescript.md) | Type conventions and patterns | Naming, type vs interface, API types |
| [Error Handling](./error-handling.md) | Error management and display | UI errors, toasts, validation messages |

### Task Checklists

Step-by-step guides for common development tasks:

- [New CRUD Feature](./checklists/new-crud-feature.md) - Complete checklist for adding a new CRUD feature
- [New Form](./checklists/new-form.md) - Checklist for creating forms with validation
- [New Data Table](./checklists/new-table.md) - Checklist for implementing data tables
- [New API Endpoint](./checklists/new-api-endpoint.md) - Checklist for integrating API endpoints

## How to Use These Specs

### For New Features

1. **Start with checklists** - Use the task checklists for step-by-step guidance
2. **Reference specs** - Consult relevant specification files for detailed patterns
3. **Copy examples** - Adapt code snippets from examples to your use case
4. **Follow decision trees** - Use decision flows to choose the right approach

### For Code Reviews

1. Check implementations against relevant specs
2. Verify patterns match established conventions
3. Ensure anti-patterns are avoided

### For Onboarding

1. Read [Architecture](./architecture.md) first to understand the system
2. Review specs relevant to your initial tasks
3. Use checklists as learning tools

## Spec File Structure

Each specification file follows this structure:

- **Overview** - What this spec covers and why it matters
- **Key Patterns** - Code snippets with detailed explanations
- **Decision Trees** - Flowcharts for choosing between approaches
- **Anti-Patterns** - Common mistakes and how to avoid them
- **Real Examples** - File paths from the actual codebase
- **Related Specs** - Cross-references to other relevant specs

## Contributing to Specs

When you discover new patterns or identify gaps:

1. Document the pattern with examples
2. Add decision criteria if multiple approaches exist
3. Include anti-patterns if you've seen mistakes
4. Update related specs with cross-references

## Quick Reference Cards

### When to Use What?

**State Management:**
- ✅ React Query → Server state (API data)
- ✅ Zustand → Global client state (auth, UI preferences)
- ✅ URL state (nuqs) → Filterable/shareable state (search, pagination)
- ✅ React Hook Form → Form state
- ✅ useState → Local component state

**Forms:**
- ✅ React Hook Form + Zod → Complex forms with validation
- ⚠️ Manual state → Only for very simple forms (2-3 fields, no validation)

**Components:**
- ✅ Shadcn UI → All UI primitives (buttons, dialogs, inputs)
- ✅ Container/presentational → Complex features with data fetching
- ✅ Custom components → Domain-specific logic

**API Calls:**
- ✅ useQuery → GET requests, data fetching
- ✅ useMutation → POST, PUT, DELETE requests
- ❌ Direct axios → Always use React Query hooks

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview and setup instructions
- [03 How/endpoints.json](../03%20How/endpoints.json) - Complete API specification
- [package.json](../package.json) - Dependencies and scripts

## Version

These specifications are based on the codebase as of 2025-10-22 and reflect patterns established across the application.

Last updated: 2025-10-22
