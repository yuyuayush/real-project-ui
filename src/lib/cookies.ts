
export const AUTH_COOKIE_NAME = "payflow_auth_token";

export function setAuthCookie(token: string, maxAgeSeconds: number = 86400): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
