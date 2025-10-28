// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  console.log('running')
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Only protect /user routes
  const isUserRoute = pathname.startsWith("/user");

  // If not logged in and accessing a /user route → redirect to login
  if (isUserRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Optional: verify JWT token validity
  if (isUserRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Invalid or expired token → redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Prevent logged-in users from seeing login page
  if (token && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/auth/login"],
};
