import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("🛡️ Middleware running for:", pathname, "| Token:", token ? "Present" : "Missing");

  const isProtectedRoute = pathname.startsWith("/user");

  // If not logged in and trying to access /user route → redirect to login
  if (isProtectedRoute && !token) {
    console.log("🔒 Not logged in → redirecting to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If logged in and visiting login or root → redirect to dashboard
  if (token && (pathname === "/auth/login" || pathname === "/")) {
    console.log("✅ Already logged in → redirecting to /user/dashboard");
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*", "/auth/login"],
};
