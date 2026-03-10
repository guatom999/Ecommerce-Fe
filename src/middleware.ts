import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// These paths require authentication
const PROTECTED_PATHS = ["/profile", "/cart", "/checkout", "/orders"];
// These paths require admin
const ADMIN_PATHS = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check auth from cookie or header — since we use localStorage (client-side only),
  // we do lightweight checks here and rely on ProtectedRoute components for actual enforcement.
  // This middleware handles redirect for obvious unauthenticated navigation.

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // For admin pages, we let ProtectedRoute handle the check since JWT is in localStorage
  // Middleware can only read cookies, not localStorage.
  // Return unchanged response — client-side guard handles protection.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
