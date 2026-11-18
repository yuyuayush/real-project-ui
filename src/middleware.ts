import { NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "payflow_auth_token";

const PUBLIC_AUTH_PATHS = ["/login"];
const PROTECTED_PREFIXES = ["/dashboard"];

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Optimistic edge check: check existence of the payflow auth cookie
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const hasAuthCookie = Boolean(authToken?.trim());

  // Root route "/" redirects to dashboard if logged in, else login
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasAuthCookie ? "/dashboard" : "/login", request.url)
    );
  }

  // Authenticated users should not access public login page
  if (hasAuthCookie && matchesPath(pathname, PUBLIC_AUTH_PATHS)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users cannot access dashboard protected routes
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
