import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "payflow_auth_token";

const PUBLIC_AUTH_PATHS = ["/login"];
const PROTECTED_PREFIXES = ["/dashboard"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Optimistic check only: this does NOT validate the token.
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const hasAuthCookie = Boolean(authToken?.trim());

  // Root route
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasAuthCookie ? "/dashboard" : "/login", request.url)
    );
  }

  // Authenticated users should not access login.
  if (hasAuthCookie && matchesPath(pathname, PUBLIC_AUTH_PATHS)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users cannot access dashboard pages.
  if (!hasAuthCookie && matchesPath(pathname, PROTECTED_PREFIXES)) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname + search);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};