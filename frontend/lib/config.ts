/**
 * Shared configuration for the frontend application
 */

export const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
}

export const BITNODES_API_URL = "https://bitnodes.io/api/v1/snapshots/latest/"
