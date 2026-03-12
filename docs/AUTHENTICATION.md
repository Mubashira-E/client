# Authentication System

This application implements a token-based authentication system using JWT tokens. The authentication is handled at multiple levels to ensure security and provide a good user experience.

## Components

### AuthGuard Component
Located at `app/(protected)/components/auth-guard.tsx`

The `AuthGuard` component is the main authentication wrapper that:
- Checks for JWT token in local storage
- Makes an API call to verify the token with `/api/user/getuser`
- Redirects to login page if authentication fails
- Shows loading state while verifying
- Renders protected content only if authentication succeeds

**Usage:**
```tsx
<AuthGuard>
  <YourProtectedContent />
</AuthGuard>;
```

### useAuth Hook
Located at `hooks/useAuth.ts`

A custom hook that provides easy access to authentication state:
```tsx
const { user, isAuthenticated, isLoading, logout } = useAuth();
```

### Auth Store
Located at `stores/useAuthStore.ts`

Zustand store that persists JWT token in localStorage:
- `jwtToken`: Current JWT token
- `setJwtToken`: Function to update token

## Authentication Flow

### Login Flow
1. User submits credentials via `LoginForm`
2. `useLoginMutationQuery` sends POST to `/api/user/login`
3. On success, JWT token is stored in auth store
4. User is redirected to protected pages

### Protected Page Access
1. `AuthGuard` checks for JWT token
2. If no token → redirect to login
3. If token exists → call `/api/user/getuser` to verify
4. If API succeeds → render protected content
5. If API fails → clear token and redirect to login

### Logout Flow
1. `useLogoutMutationQuery` sends POST to `/api/user/logout`
2. JWT token is cleared from auth store
3. User is redirected to login page

## Error Handling

### Global Error Handling
The React Query client in `providers.tsx` has global error handling:
- Any 401 response automatically clears token and redirects to login
- This catches expired tokens or unauthorized access

### Local Error Handling
- `AuthGuard` handles authentication verification errors
- Individual components handle their own API errors
- Login form shows user-friendly error messages

## API Endpoints

- `POST /api/user/login` - User login
- `GET /api/user/getuser` - Verify token and get user details
- `POST /api/user/logout` - User logout

## Security Features

1. **Token Validation**: Every protected page verifies token with API
2. **Automatic Logout**: 401 errors trigger automatic logout
3. **Persistent Storage**: Token persists across browser sessions
4. **Loading States**: Prevents flash of unauthenticated content
5. **Error Boundaries**: Graceful handling of authentication failures

## File Structure

```
app/(protected)/
├── components/
│   ├── auth-guard.tsx         # Main authentication wrapper
│   └── providers.tsx          # React Query setup with error handling
├── layout.tsx                 # Protected layout with AuthGuard
hooks/
├── useAuth.ts                 # Authentication hook
stores/
├── useAuthStore.ts            # JWT token storage
queries/auth/
├── useLoginMutationQuery.ts   # Login API call
├── useLogoutMutationQuery.ts  # Logout API call
└── useGetUserDetailsQuery.ts  # User verification API call
```

## Development Notes

- The `useGetUserDetailsQuery` is optimized to only run when a JWT token exists
- All API requests automatically include the Bearer token via axios interceptors
- The authentication system is designed to be secure by default - denying access unless explicitly authenticated
