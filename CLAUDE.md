# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an EMR (Electronic Medical Records) client application built with Next.js 15, TypeScript, and modern web technologies. The application manages patient records, visits, treatments, and various medical administrative tasks.

## Commands

### Development
```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint errors
```

### Testing
```bash
bun run test             # Run all tests with Vitest
bun run test:ui          # Run tests with UI
bun run test:coverage    # Run tests with coverage
```

### Maintenance
```bash
bun run knip             # Find unused files, dependencies, and exports
bun run clean            # Clean all generated files (lock, .next, node_modules)
```

### Production Deployment
```bash
bun start:prod           # Install, build, and start on port 8017
```

## Architecture

### Directory Structure

- **app/** - Next.js App Router pages and layouts
  - **(protected)/** - Protected routes requiring authentication
    - **patients/** - Patient and visit management pages
    - **masters/** - Master data configuration (treatments, rooms, packages, etc.)
    - **excel-upload/** - Bulk data upload functionality
  - **login/** - Authentication pages
  - **debug/** - Debug utilities

- **components/** - Reusable React components
  - **ui/** - Shadcn UI components (Radix UI + Tailwind)

- **queries/** - React Query hooks organized by domain
  - **auth/** - Authentication queries and mutations
  - **general/** - General master data queries (gender, nationality, language, etc.)
  - **masters/** - Master data management queries

- **stores/** - Zustand stores with persistence
  - **useAuthStore.ts** - JWT token and authentication state

- **lib/** - Utility libraries
  - **axios.ts** - Configured API client with interceptors
  - **date-time-utils.ts** - Date/time formatting utilities
  - **utils.ts** - General utilities
  - **components/** - Shared component utilities

- **hooks/** - Reusable React hooks
  - **useAuth.ts** - Authentication logic
  - **use-mobile.ts** - Responsive breakpoint detection

- **types/** - TypeScript type definitions
- **endpoints/** - API endpoint constants (deprecated, see `03 How/endpoints.json`)
- **03 How/** - API documentation and specifications
  - **endpoints.json** - Complete OpenAPI 3.0 specification with all API endpoints and schemas

### Key Technologies

- **Next.js 15** with App Router and experimental view transitions
- **TypeScript** with strict configuration
- **React Query (@tanstack/react-query)** for server state management
- **Zustand** for client state management with localStorage persistence
- **Axios** for HTTP requests with automatic camelCase conversion
- **Radix UI** primitives with custom styling
- **Tailwind CSS 4** for styling
- **React Hook Form** with Zod validation
- **Vitest** with Testing Library for testing
- **Bun** as package manager and runtime

### Data Flow Patterns

1. **API Calls**: All API calls go through `lib/axios.ts` which:
   - Adds JWT bearer token from `useAuthStore`
   - Transforms responses to camelCase
   - Uses custom array serialization for query params

2. **State Management**:
   - Server state: React Query with queries in `queries/` directory
   - Client state: Zustand stores in `stores/` directory
   - Form state: React Hook Form with Zod schemas

3. **Authentication**:
   - JWT stored in `useAuthStore` (persisted to localStorage)
   - Protected routes in `app/(protected)/`
   - Login mutation in `queries/auth/useLoginMutationQuery.ts`

4. **Route Protection**: Routes under `(protected)` require authentication

### Path Aliases

```typescript
"@/*" → "./*"              // Root-level imports
"@/queries/*" → "./queries/*"  // Query hooks
```

### Environment Variables

Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://45.143.62.174:8022)

Optional:
- `NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER` - Show/hide terms modal checkbox (true/false)

### Code Conventions

- **TypeScript**: Use `type` over `interface` (enforced by ESLint)
- **API Models**: Response models use camelCase (auto-converted from snake_case)
- **Styling**: Tailwind CSS with utility classes, no CSS modules
- **Components**: Functional components with hooks
- **File naming**: kebab-case for files, PascalCase for components
- **Query hooks**: Named `use[Entity][Operation]Query` pattern

### Testing

- Tests colocated with source files using `.test.ts` or `.spec.ts` suffix
- Vitest with jsdom environment
- Testing Library for component tests
- Setup file: `vitest.setup.ts`

### Linting

Uses @antfu/eslint-config with:
- Double quotes, semicolons, 2-space indentation
- Next.js specific rules
- TanStack Query rules
- React specific rules

### API Documentation

The complete API specification is available in `03 How/endpoints.json` as an OpenAPI 3.0 specification. This includes:

- **Base URL**: `http://45.143.62.174:8022`
- **Swagger UI**: `http://45.143.62.174:8022/swagger/index.html`
- **OpenAPI Spec**: `http://45.143.62.174:8022/swagger/v1/swagger.json`

**Available Resource Endpoints:**
- `/api/v1/clinician` - Clinician management (GET, POST, PUT by ID)
- `/api/v1/facility` - Facility management (GET, POST, PUT by ID)
- `/api/v1/language` - Language management (GET, POST, PUT by ID)
- `/api/v1/medicaldepartment` - Medical department management (GET, POST, GET by ID)
- `/api/v1/nationality` - Nationality management (GET, POST, GET by ID)
- `/api/v1/regulatory` - Regulatory management (GET, POST, PUT by ID)
- `/api/v1/treatment` - Treatment management (GET, POST, PUT by ID)
- `/api/v1/visit/import` - Visit data import (POST with multipart/form-data)

**Common Query Parameters** (for list endpoints):
- `PageNumber` - Page number for pagination
- `PageSize` - Number of items per page
- `SearchTerms` - Search filter
- `SortOrderBy` - Sort direction (boolean)

All request/response schemas are defined in the `components.schemas` section of `03 How/endpoints.json`.

### Development Specifications

For detailed development patterns, best practices, and step-by-step guides, see the **[specs/](./specs/)** directory:

**Core Specifications:**
- [Architecture](./specs/architecture.md) - System architecture, tech stack, data flow
- [Component Patterns](./specs/component-patterns.md) - Container/presentational patterns, composition
- [API Integration](./specs/api-integration.md) - React Query patterns, queries, mutations
- [Form Patterns](./specs/form-patterns.md) - React Hook Form + Zod validation
- [State Management](./specs/state-management.md) - Zustand, URL state, decision trees
- [Page & Routing](./specs/page-routing.md) - Next.js App Router patterns
- [Styling & UI](./specs/styling-ui.md) - Tailwind, Shadcn UI, responsive design
- [Table Patterns](./specs/table-patterns.md) - Data tables with filtering, sorting, pagination
- [Testing](./specs/testing.md) - Vitest, Testing Library patterns
- [TypeScript](./specs/typescript.md) - Type conventions, naming patterns
- [Error Handling](./specs/error-handling.md) - Error UI, toasts, validation

**Task Checklists:**
- [New CRUD Feature](./specs/checklists/new-crud-feature.md) - Complete checklist for CRUD features
- [New Form](./specs/checklists/new-form.md) - Creating forms with validation
- [New Data Table](./specs/checklists/new-table.md) - Implementing data tables
- [New API Endpoint](./specs/checklists/new-api-endpoint.md) - Integrating API endpoints

**Quick Reference:** See [specs/README.md](./specs/README.md) for the complete index and quick navigation.

These specifications enable **spec-driven development** - providing clear patterns, decision trees, anti-patterns, and real examples from the codebase for building new features consistently.

### Important Notes

- The application uses **Bun** as the package manager, not npm or yarn
- API responses are automatically converted from snake_case to camelCase
- Authentication state persists across sessions via localStorage
- The app uses Next.js 15's experimental view transitions
- Images must be from configured remote patterns (see `next.config.ts`)
- Refer to `03 How/endpoints.json` for the complete API specification and schemas
