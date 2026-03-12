# Setup & Deployment Guide

This document covers the prerequisites, local development setup, and deployment instructions.

## Prerequisites

Ensure you have the following installed on your local machine:

*   **Node.js**: LTS version (e.g., v18 or newer).
    *   Verify: `node -v`
*   **Bun**: v1.x or newer.
    *   Verify: `bun --version`
    *   Install: `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows) or `curl -fsSL https://bun.sh/install | bash` (Mac/Linux)
*   **Git**: For version control.
    *   Verify: `git --version`

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Environment Variables

Create a `.env.local` file in the root directory. You can copy `.env.example` if available.

**Required Variables:**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://45.143.62.174:8022

# Branding Configuration
NEXT_PUBLIC_LOGO_URL=/assets/images/logo.svg
NEXT_PUBLIC_ORG_NAME=Cusana

# Terms Modal Configuration
# Set to "true" to show the "Don't show this again" checkbox
NEXT_PUBLIC_DISPLAY_DONT_SHOW_MESSAGE_BANNER=true
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Run the Development Server

```bash
bun run dev
```

The application will start at `http://localhost:3000`.

## Testing

Run the test suite to ensure everything is working correctly:

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in UI mode
bun run test:ui
```

## Production Build & Deployment

### Building for Production

To create an optimized production build:

```bash
bun run build
```

### Running Production Build Locally

After building, you can start the production server locally:

```bash
bun run start
```

### Deploying to Server

1.  **Clone on Server**: Clone the repository on the target server.
2.  **Install & Build**:
    ```bash
    bun install
    bun run build
    ```
3.  **Start Production Server**:
    ```bash
    bun start:prod
    ```
    *Note: Check `package.json` for the specific `start:prod` script definition. It typically runs the Next.js server on a specific port.*

Alternatively, you can build locally and copy the `.next`, `public`, and `package.json` files to the server, then run `bun start` (or `bun start:prod`).
