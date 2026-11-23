import { NextResponse } from "next/server";
import { getDashboardPath, isRouteAllowed } from "@/lib/authHelpers";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/department-dashboard") ||
    pathname.startsWith("/my-tasks") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/issues/new") ||
    pathname.startsWith("/profile");

  // If visiting protected route without any session token
  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user has session token, verify role via Better Auth get-session
  if (sessionToken) {
    try {
      const origin = request.nextUrl.origin;
      const sessionRes = await fetch(`${origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        const user = sessionData?.user;

        if (user) {
          // If authenticated user tries to visit /login or /register, redirect to their role dashboard
          if (isAuthPage) {
            return NextResponse.redirect(new URL(getDashboardPath(user.role), request.url));
          }

          // If visiting a protected dashboard, enforce role permission
          if (isProtectedPath && !isRouteAllowed(pathname, user.role)) {
            const target = new URL(getDashboardPath(user.role), request.url);
            target.searchParams.set("denied", "true");
            return NextResponse.redirect(target);
          }
        } else if (isProtectedPath) {
          // Token is invalid/expired
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }
      }
    } catch (err) {
      // Allow request to continue if transient fetch occurs
      console.error("Middleware session verification error:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/department-dashboard/:path*",
    "/my-tasks/:path*",
    "/admin-dashboard/:path*",
    "/issues/new/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
