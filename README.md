# Redsky Ayurvedic — EMR Client

> Electronic Medical Records platform for Ayurvedic clinics. Manages the full patient lifecycle — registration, appointment booking, clinical visits, treatment tracking, inventory, and administrative configuration — through a modern, role-secured web interface.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Application Modules](#application-modules)
  - [Dashboard](#dashboard)
  - [Appointments](#appointments)
  - [Patients](#patients)
  - [Masters](#masters)
  - [Excel Upload](#excel-upload)
  - [Roles & Permissions](#roles--permissions)
  - [Users](#users)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Form Handling](#form-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Developer Reference](#developer-reference)

---

## Overview

Redsky Ayurvedic EMR is a Next.js 15 client application backed by a .NET REST API. It supports multi-tenant clinic configurations, JWT-based role and permission security, real-time slot management, and bulk data import via Excel.

The system is designed for international use, supporting multilingual clinician filtering (by language and nationality), Emirates ID capture, and configurable organisation branding via environment variables.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Runtime / Package Manager | Bun v1.x |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Component Library | Shadcn UI (Radix UI) |
| Server State | TanStack Query v5 |
| Client State | Zustand (persisted to localStorage) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with JWT interceptors) |
| Testing | Vitest + React Testing Library |
| Deployment | Fly.io (region: maa) / OpenNext Cloudflare |
| Monitoring | Sentry |

---

## Getting Started

### Prerequisites

- **Node.js** LTS (v18+) — `node -v`
- **Bun** v1.x — `bun --version`
  - Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`
  - Mac / Linux: `curl -fsSL https://bun.sh/install | bash`
- **Git** — `git --version`

### Local Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd emr-app

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your backend address

# 4. Start development server
bun dev
```

The app runs on `http://localhost:3000` by default.

### Useful Scripts

```bash
bun dev              # Development server with hot reload
bun build            # Production build
bun start            # Start production server
bun test             # Run all tests (Vitest)
bun test:ui          # Vitest UI
bun test:coverage    # Coverage report
bun lint             # ESLint
bun lint:fix         # ESLint with auto-fix
bun clean            # Remove lockfile, .next cache, node_modules
bun run start:prod   # Full production install + build + start on port 8017
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_API_URL=http://localhost:7221       # Backend API base URL
NEXT_PUBLIC_TYPE=AYURVEDIC                      # Application type
NEXT_PUBLIC_ORG_NAME=AYURVEDA                  # Organisation display name
NEXT_PUBLIC_LOGO_URL=/assets/images/logo.svg   # Sidebar logo path
NEXT_PUBLIC_LOGIN_IMAGE_URL=/assets/images/login/login-banner.jpg  # Login page image
SENTRY_AUTH_TOKEN=<your-sentry-token>           # Sentry error monitoring
```

All `NEXT_PUBLIC_` variables are exposed to the browser. Never put secrets in them.

---

## Project Structure

```
emr-app/
├── app/
│   ├── (protected)/          # All authenticated routes
│   │   ├── appointments/     # Booking, list, reschedule, update
│   │   ├── dashboard/        # Power BI embedded dashboard
│   │   ├── excel-upload/     # Bulk import (visits, sessions)
│   │   ├── masters/          # Reference data management
│   │   │   ├── clinician-management/
│   │   │   ├── general/      # Language, Nationality
│   │   │   ├── inventory/
│   │   │   ├── rooms/
│   │   │   └── treatment-management/
│   │   ├── patients/         # Patient list, registration, visits
│   │   ├── roles/            # Role and permission management
│   │   └── users/            # User management
│   ├── debug/                # Health check page
│   └── login/                # Public login page
├── components/
│   └── ui/                   # Shared Shadcn UI components
├── docs/                     # Architecture, auth, setup docs
├── endpoints/
│   └── index.ts              # Centralised API endpoint constants
├── hooks/                    # Shared React hooks
├── lib/                      # Axios instance, utilities, date helpers
├── queries/                  # TanStack Query hooks (per domain)
├── specs/                    # Development specifications and checklists
├── stores/                   # Zustand global stores
├── types/                    # Shared TypeScript types
└── public/                   # Static assets, Excel templates
```

---

## Application Modules

### Dashboard

**Route:** `/dashboard`

Embeds a Power BI report providing clinic-level analytics — visit volumes, patient demographics, treatment utilisation, and revenue summaries. The report is rendered full-height inside a sandboxed iframe. Power BI connection settings are configurable from **Masters → Power BI Settings**.

---

### Appointments

**Routes:** `/appointments/book-appointment`, `/appointments/appointment-list`

The appointments module covers the complete booking workflow.

#### Book Appointment

A multi-step form that guides staff through:

1. **Patient selection** — search for an existing patient by name, MRN, or Emirates ID, or register a new patient inline (first name, last name, mobile, Emirates ID, gender, nationality).
2. **Clinician selection** — a searchable modal showing available clinicians, filterable by:
   - Department
   - Language spoken
   - Nationality
3. **Date & slot selection** — fetches real-time available slots from the backend for the selected clinician and date. Slots are displayed as time-labelled buttons; unavailable slots are disabled.
4. **Room allocation** — optional room assignment for the visit.
5. **Preview & confirm** — summary card showing all selected details before final submission.

On successful booking a confirmation modal is shown with the visit reference.

#### Appointment List

Displays all visits in a paginated, sortable table. Features include:

- Search by patient name, MRN, or clinician
- Filter by status (Scheduled, Arrived, Completed, Cancelled), date range, and department
- Toggleable column visibility
- **View** — full read-only detail of any appointment
- **Reschedule** — change the visit date and/or clinician; a review modal confirms the change before saving
- **Update** — change visit status directly from a dropdown (Scheduled → Arrived → Completed / Cancelled)

**Visit Status Values:**

| Value | Meaning |
|---|---|
| 1 | Scheduled |
| 2 | Arrived |
| 3 | Completed |
| 4 | Cancelled |

---

### Patients

**Routes:** `/patients/patient-list`, `/patients/register`, `/patients/visit-list`

#### Patient List

Paginated table of all registered patients with search and column-toggle controls. From each patient row, staff can:

- **View** — full patient profile (demographics, visits, sessions)
- **Amendment** — update patient demographic details
- **New Visit** — create a new visit directly from the patient record
- **Visit Confirmation** — confirm a pending visit

The header shows total patient count and the most recently added patient.

#### Patient Registration

A standalone registration form for new patients capturing:

- Name (first, last), age, gender
- Mobile number (international format)
- Emirates ID (`784-XXXX-XXXXXXX-X` format)
- Nationality (dropdown sourced from the Nationality master)

#### Visit List

All visits across all patients in a single, searchable table. Filterable by status and department. The header shows total visit count and the most recent visit. Each row links to a detailed visit view.

---

### Masters

The Masters section contains all reference/configuration data for the clinic. Changes here flow through to dropdowns and filters throughout the system.

**Route prefix:** `/masters`

#### Clinician Management (`/masters/clinician-management`)

Three tabs — **Clinicians**, **Medical Departments**, and **Sub-Service Classifications**.

**Clinicians** — Create, edit, activate/deactivate individual clinicians. Each clinician record includes:
- Name, code, profession, major
- Medical Department (FK)
- Language (FK) — used for international patient–clinician matching
- Nationality (FK)

Clinicians can be viewed as cards or a table. Inline schedule management allows setting availability windows per clinician.

**Medical Departments** — Departments that clinicians belong to (e.g. Orthopaedics, Panchakarma). Supports create, edit, and status toggle.

**Sub-Service Classifications** — Sub-categories of medical services. Supports full CRUD.

#### General Masters (`/masters/general`)

Two tabs — **Language** and **Nationality**.

**Language** — Create and edit spoken languages used for clinician–patient matching. Each record has a name and ISO code.

**Nationality** — Create and edit nationalities for both clinician and patient profiling. Each record has a name and ISO code.

#### Inventory (`/masters/inventory`)

Two tabs — **Inventory Items** and **Item Categories**.

Manage medical consumables and supplies used in treatments. Each item is linked to a category, carries unit-of-measure, quantity, and reorder threshold. A stock alerts widget highlights items below reorder level. Bulk import is supported via Excel upload.

#### Rooms (`/masters/rooms`)

Two tabs — **Rooms** and **Room Types**.

Rooms are physical treatment spaces. Each room is assigned a type, capacity, and active status. Room types are configurable reference values (e.g. Therapy Room, Consultation Room).

#### Treatment Management (`/masters/treatment-management`)

Three tabs — **Individual Treatments**, **Package Plans**, and **Wellness Programs**.

**Individual Treatments** — Single treatment procedures with code, name, duration, and associated inventory items. Supports Excel bulk import.

**Package Plans** — Bundled treatment packages combining multiple individual treatments. Packages define validity period, session count, price, and assigned clinician/room defaults.

**Wellness Programs** — Holistic programs grouping multiple packages into a structured care pathway. Supports Excel bulk import.

#### Power BI Settings (`/masters/powerbi-settings`)

Configuration form for the embedded Power BI report URL shown on the Dashboard.

---

### Excel Upload

**Route:** `/excel-upload`

Provides bulk data import for visits and treatment sessions via Excel files. The module has two tabs:

- **File Upload** — drag-and-drop or browse to upload an `.xlsx` file. Select the template type (Demographics / Advance Payment / Sessions) before uploading.
- **Job List** — tracks all past upload jobs with status (Pending, Processing, Completed, Failed), row counts (total, inserted, failed), and timestamp. Clicking a job shows row-level validation errors.

Pre-formatted Excel templates are available for download from `/public/assets/Excel/`.

Treatment management pages (Individual Treatments, Package Plans, Wellness Programs) have their own dedicated Excel upload pages accessible from the list views.

---

### Roles & Permissions

**Route:** `/roles`

Roles control what staff members can do in the system. Each role is a named collection of granular permissions.

- Create and name roles
- Assign permissions per module (e.g. `Appointments.View`, `Appointments.Create`, `Roles.Create`)
- Activate / deactivate roles
- Search roles by name

Permissions are enforced both on the frontend (buttons and actions are hidden when the current user lacks the required permission) and on the backend API.

---

### Users

**Route:** `/users`

Manage staff accounts who log in to the system.

- Create users with name, email, role assignment, and initial password
- Edit user profile and role
- Activate / deactivate accounts
- Search by name or email

Each user is linked to exactly one role. All API actions respect the permissions attached to that role.

---

## Authentication

The application uses JWT bearer tokens stored in `localStorage` via Zustand persist middleware.

**Login flow:**
1. Staff submits credentials at `/login`
2. Backend returns a JWT token
3. Token is stored in `useAuthStore` and attached to every subsequent API request via the Axios request interceptor
4. `AuthGuard` component wraps all protected routes — it verifies the token on each page load and redirects to `/login` on failure or expiry

**Logout:**
- Any `401` response from the API triggers a debounced logout (concurrent 401s fire only one redirect)
- Manual logout clears the token and redirects to `/login`

**Permission checks** use the `hasPermission(userDetails, "Module.Action")` utility (`lib/utils/auth.ts`). Buttons such as Create, Edit, and Delete are conditionally rendered based on the current user's permissions.

---

## API Integration

All API calls go through the centralised Axios instance at `lib/axios.ts`. The base URL is set from `NEXT_PUBLIC_API_URL`.

Endpoint strings are defined in `endpoints/index.ts` and grouped by domain (`authEndpoints`, `generalEndpoints`, `visitEndpoints`, etc.). Never hard-code an API path inside a component.

**Query hooks** live in `queries/` and follow the naming convention:
- `useGet<Entity>Query` — GET (read)
- `useCreate<Entity>Mutation` — POST
- `useUpdate<Entity>Mutation` — PUT
- `usePatch<Entity>Mutation` — PATCH
- `useDelete<Entity>Mutation` — DELETE

**Key API contracts:**

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/auth/login` | POST | Authenticate user, receive JWT |
| `/api/v1/patient` | POST | Register new patient |
| `/api/v1/visit` | GET | List all visits (paginated) |
| `/api/v1/visit` | POST | Create a new appointment |
| `/api/v1/visit/{id}` | GET | Get visit details |
| `/api/v1/visit/reschedule` | PUT | Reschedule visit |
| `/api/v1/visit/status` | PATCH | Change visit status |
| `/api/v1/slot/available` | GET | Fetch available time slots |
| `/api/v1/clinician` | GET | List clinicians (filterable by department, language, nationality) |
| `/api/v1/language` | GET / POST | Language master CRUD |
| `/api/v1/nationality` | GET / POST | Nationality master CRUD |
| `/api/v1/medicaldepartment` | GET / POST | Department master CRUD |

Slot times are always returned as `"HH:mm"` strings from the backend — never parse them with `new Date()`.

---

## State Management

**Server state** (remote data, loading/error flags, caching) is handled entirely by TanStack Query. Cache keys include the endpoint string plus any filter parameters so that filtered views are cached independently.

**Client state** (UI-only, persisted session data) is handled by Zustand:

| Store | Location | Contents |
|---|---|---|
| `useAuthStore` | `stores/useAuthStore.ts` | JWT token, terms acceptance, login flag |

URL state (search terms, active filters, pagination page) is managed with `nuqs` — filter values live in the query string so pages are bookmarkable and shareable.

---

## Form Handling

All forms use React Hook Form with Zod schemas for validation. The pattern is:

```ts
const schema = z.object({ ... });
type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

Multi-step forms (such as book-appointment) use a single `useForm` instance passed down via `FormProvider` / `useFormContext`. Each step reads and writes to the same shared form state without prop drilling.

---

## Testing

Tests are colocated with the files they test (`.test.tsx` / `.test.ts` suffix) and run with Vitest.

```bash
bun test              # Run all tests once
bun test:ui           # Interactive Vitest UI
bun test:coverage     # Generate coverage report
```

The test setup file is `vitest.setup.ts`. Configuration is in `vitest.config.mts`.

---

## Deployment

### Fly.io

The project includes a `fly.toml` configured for the `maa` (Chennai) region.

```bash
fly deploy
```

The app listens on internal port `3000` with HTTPS forced. Machines auto-start and auto-stop with a minimum of 0 running instances (scales to zero when idle).

### Production start (manual)

```bash
bun run start:prod
# Equivalent to: bun install && bun build && bun start -p 8017
```

### OpenNext / Cloudflare

`open-next.config.ts` is present for Cloudflare Pages/Workers deployment via the `@opennextjs/cloudflare` adapter.

---

## Developer Reference

### Adding a new API endpoint

1. Add the path string to `endpoints/index.ts`
2. Create a query or mutation hook in `queries/<domain>/`
3. Use the hook in your component — never call `api` directly from a component

### Adding a new master table

Follow the pattern in any existing master (e.g. `masters/general/language/`):

```
masters/general/<entity>/
  components/
    <entity>-table.tsx
    <entity>-header.tsx
    data.ts
  create/
    components/
      add-<entity>-form.tsx
  [id]/edit/
    components/
      edit-<entity>-header.tsx
  stores/use<Entity>Store.ts
  <entity>.tsx
```

### Specs and checklists

The `specs/` directory contains detailed development guides:

| File | Purpose |
|---|---|
| `specs/architecture.md` | Directory structure and data flow |
| `specs/api-integration.md` | Query and mutation patterns |
| `specs/form-patterns.md` | React Hook Form + Zod conventions |
| `specs/table-patterns.md` | Table, pagination, column toggle |
| `specs/component-patterns.md` | Container/presentational split |
| `specs/error-handling.md` | API error display conventions |
| `specs/state-management.md` | When to use Query vs Zustand vs nuqs |
| `specs/checklists/new-crud-feature.md` | Step-by-step for new CRUD pages |
| `specs/checklists/new-form.md` | Step-by-step for new forms |
| `specs/checklists/new-table.md` | Step-by-step for new table pages |
| `specs/checklists/new-api-endpoint.md` | Step-by-step for wiring a new API |

---

*Redsky Ayurvedic EMR — built with Next.js 15, .NET, and TanStack Query.*
