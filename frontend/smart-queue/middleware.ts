import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =======================
// ROUTE GROUPS
// =======================
const adminRoutes = ["/admin"];
const customerRoutes = ["/customer"];
const protectedRoutes = ["/Profile"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isCustomerRoute = customerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // =======================
  // NOT AUTHENTICATED
  // =======================
  if ((isAdminRoute || isCustomerRoute || isProtectedRoute) && !token) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // =======================
  // ROLE CHECK
  // =======================
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/customer/home", request.url));
  }

  if (isCustomerRoute && role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // =======================
  // AUTH PAGES (LOGIN / REGISTER)
  // =======================
  if (isAuthRoute && token) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/customer/home", request.url));
  }

  return NextResponse.next();
}

// =======================
// MATCHER
// =======================
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
