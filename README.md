# EMR Client Application

This is the EMR (Electronic Medical Records) client application, a modern web platform built for healthcare management.

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

*   **[Setup & Deployment](./docs/SETUP.md)**: Prerequisites, installation, environment variables, and deployment guide.
*   **[Architecture](./docs/ARCHITECTURE.md)**: Technical stack, state management (Zustand), API layer (Axios + TanStack Query), and folder structure.
*   **[Coding Patterns](./docs/PATTERNS.md)**: Standards for UI (Tailwind/Shadcn), Data Fetching, Forms, and Testing.
*   **[Authentication](./docs/AUTHENTICATION.md)**: Deep dive into the JWT-based authentication flow and security features.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

## 🛠️ Stack Overview

*   **Framework**: Next.js 15 (App Router)
*   **Runtime**: Bun
*   **UI**: React 19, Tailwind CSS v4, Shadcn UI
*   **State**: Zustand (Client), TanStack Query (Server)
*   **Testing**: Vitest
