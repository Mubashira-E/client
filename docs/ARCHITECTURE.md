# Architecture Overview

This document provides a high-level overview of the application architecture, technical stack, and core design principles.

## Technical Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh) (v1.x)
- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Component Library**: [Shadcn UI](https://ui.shadcn.com) (Radix UI based)
- **State Management**:
  - Client State: [Zustand](https://github.com/pmndrs/zustand)
  - Server State: [TanStack Query](https://tanstack.com/query/latest) (v5)
- **Form Handling**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com)

## Core Architecture

### Client-Side State (Zustand)

Global client-side state (such as Authentication) is managed using **Zustand**.
- **Location**: `stores/` directory (e.g., `useAuthStore.ts`).
- **Persistence**: We use `persist` middleware to store critical state (like JWT tokens) in `localStorage`.
- **Usage**: Used for session management, UI toggles, and other non-server derived global state.

### Server-Side State (TanStack Query)

All data fetching and synchronization with the backend is handled by **TanStack Query**.
- **Location**: `queries/` directory.
- **Pattern**: Custom hooks (e.g., `useGetAllUsersQuery`, `useLoginMutationQuery`) wrap the query/mutation logic.
- **Benefits**: Automatic caching, background refetching, loading/error states, and optimistic updates.

### API Layer (Axios)

We use **Axios** as the HTTP client, configured with interceptors.
- **Location**: `lib/axios.ts`.
- **Interceptors**:
  - **Request**: Automatically attaches the `Authorization: Bearer <token>` header from the Zustand auth store.
  - **Response**: Handles global errors (e.g., redirecting to login on 401 Unauthorized).
  - **Transformation**: Uses `camelcase-keys` to convert backend snake_case responses to frontend camelCase automatically.

## Folder Structure

The project follows a standard Next.js App Router structure with feature-based organization.

```
.
├── app/                  # Next.js App Router pages and layouts
│   ├── (protected)/      # Protected routes (require auth)
│   ├── login/            # Public login route
│   └── layout.tsx        # Root layout
├── components/           # Shared UI components
│   ├── ui/               # Shadcn UI primitives (Button, Input, etc.)
│   └── ...               # Global components (Header, Sidebar)
├── docs/                 # Project documentation
├── endpoints/            # API endpoint constants
├── hooks/                # Generic custom React hooks
├── lib/                  # Utilities, configurations, and external library setups
│   ├── axios.ts          # Axios instance configuration
│   └── utils.ts          # Helper functions (cn, etc.)
├── queries/              # TanStack Query hooks (organized by feature)
│   ├── auth/
│   ├── user/
│   └── ...
├── stores/               # Zustand state stores
└── types/                # TypeScript type definitions
```
