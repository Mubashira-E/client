/**
 * Application configuration utilities
 * Centralizes environment variable access with default fallback values
 */

/**
 * Get the logo URL from environment variable with fallback
 * @returns Logo URL string
 */
export function getLogoUrl(): string {
  return process.env.NEXT_PUBLIC_LOGO_URL || "/assets/images/logo.svg";
}

/**
 * Get the organization name from environment variable with fallback
 * @returns Organization name string
 */
export function getOrgName(): string {
  return process.env.NEXT_PUBLIC_ORG_NAME || "Cusana";
}

/**
 * Get the login image URL from environment variable
 * @returns Login image URL string or null if not set
 */
export function getLoginImageUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_LOGIN_IMAGE_URL;
  return url && url.trim() !== "" ? url.trim() : null;
}
