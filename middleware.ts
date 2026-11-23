import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_ENV = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production-1234567890abcdef";
const secretKey = new TextEncoder().encode(JWT_SECRET_ENV);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  let isAuthenticated = false;
  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, secretKey, {
        algorithms: ["HS256"],
      });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtectedPath =
    pathname.startsWith("/dashboard") || pathname.startsWith("/inventory");

  // Protect /dashboard and /inventory: redirect unauthenticated users to /login
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already authenticated users visiting /login to /dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/inventory/:path*", "/inventory", "/login"],
};
