const DEFAULT_PUBLIC_API_BASE_URL = "https://ratata-bay.vercel.app";

const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_PUBLIC_API_BASE_URL;

const internalApiBaseUrl =
  process.env.INTERNAL_API_BASE_URL || publicApiBaseUrl;

const rawApiBaseUrl =
  typeof window === "undefined" ? internalApiBaseUrl : publicApiBaseUrl;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
