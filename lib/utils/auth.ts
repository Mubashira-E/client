import type { UserDetails, UserPermission } from "@/queries/auth/useGetUserDetailsQuery";

export function hasPermission(user: UserDetails | undefined | null, permission: string) {
  // Add null checks for both user AND user.permissions
  if (!user || !user.permissions) {
    return false;
  }

  return user.permissions.includes(permission as UserPermission);
}

export function hasAnyPermission(user: UserDetails | undefined | null, permissions: string[]) {
  // Add null checks here too
  if (!user || !user.permissions) {
    return false;
  }

  return permissions.some(permission => hasPermission(user, permission));
}
