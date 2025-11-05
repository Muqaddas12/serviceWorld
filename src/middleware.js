import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

// 🧠 Auto-detect base URL (works on local + deployed)
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 🔹 Fetch maintenance settings safely
  let maintenanceMode = false;
  try {
    const res = await fetch(`${BASE_URL}/api/maintenance`, {
      cache: "no-store",
    });
    const data = await res.json();
    maintenanceMode = data?.maintenanceMode;
  } catch (err) {
    console.error("⚠️ Failed to check maintenance mode:", err);
  }

  const token = request.cookies.get("token")?.value;

  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = ["/auth/login", "/auth/signup", "/admin/login"].includes(pathname);
  const isMaintenancePage = pathname === "/maintenance";
  const isRoot = pathname === "/";

  console.log(
    `🛡️ Middleware: ${pathname} | Token: ${token ? "✅" : "❌"} | Maintenance: ${
      maintenanceMode ? "ON" : "OFF"
    } | BaseURL: ${BASE_URL}`
  );

  // 🚧 Maintenance Mode (users redirected to /maintenance)
  if (maintenanceMode && !isAdminRoute && !isMaintenancePage) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // 🟡 Allow public auth routes
  if (isAuthPage) return NextResponse.next();

  // 🔒 Redirect if missing token
  if ((isUserRoute || isAdminRoute) && !token) {
    const redirectTo = isAdminRoute ? "/admin/login" : "/auth/login";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // ✅ Verify token
  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      user = payload;
    } catch {
      const redirectTo = isAdminRoute ? "/admin/login" : "/auth/login";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // 🔁 Redirect logged-in users away from login/root
  if (token && (isAuthPage || isRoot)) {
    const dashboard =
      user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*", "/admin/:path*", "/auth/:path*", "/maintenance"],
};
