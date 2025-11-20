import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // ONE SECRET

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Cookies
  const userToken = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;

  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");

  const isUserLoginPage = pathname === "/auth/login";
  const isAdminLoginPage = pathname === "/admin/login";

  const isRoot = pathname === "/";

  let user = null;
  let admin = null;

  // 🔹 Verify USER token
  if (userToken) {
    try {
      const { payload } = await jwtVerify(userToken, SECRET);
      user = payload;
    } catch {
      user = null;
    }
  }

  // 🔹 Verify ADMIN token
  if (adminToken) {
    try {
      const { payload } = await jwtVerify(adminToken, SECRET);
      admin = payload;
    } catch {
      admin = null;
    }
  }

  // 1️⃣ BLOCK LOGIN PAGES IF LOGGED IN
  if (user && isUserLoginPage) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (admin && isAdminLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 2️⃣ ROOT REDIRECT IF LOGGED IN
  if (isRoot && (user || admin)) {
    return NextResponse.redirect(
      new URL(admin ? "/admin/dashboard" : "/user/dashboard", request.url)
    );
  }

  // 3️⃣ PROTECT ADMIN ROUTES
  if (isAdminRoute && !isAdminLoginPage) {
    if (!adminToken || !admin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 4️⃣ PROTECT USER ROUTES
  if (isUserRoute&&!adminToken) {
    if (!userToken || !user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 5️⃣ BLOCK CROSS-ACCESS (user cannot open admin, admin cannot open user)
  if (isUserRoute && admin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isAdminRoute && user) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*", "/admin/:path*", "/auth/:path*"],
};
