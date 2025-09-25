import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ---------------------------
  // 1. User belum login
  // ---------------------------
  if (!token) {
    if (
      pathname.startsWith("/libraries") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/history")
    ) {
      // encode path supaya aman
      const encodedPath = encodeURIComponent(pathname);

      const redirectUrl = new URL("/", req.url);
      redirectUrl.searchParams.set("callbackUrl", encodedPath);
      redirectUrl.searchParams.set("isLogin", "false");

      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // ---------------------------
  // 2. User sudah login
  // ---------------------------
  if (token) {
    // proteksi login & register untuk user yang sudah login
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      const dashboardUrl = new URL("/", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // ---------------------------
    // 3. Role-based protection
    // ---------------------------
    const roleId = token.role; // pastikan roleId sudah di-set di JWT
    if (pathname.startsWith("/dashboard/admin") && roleId !== 1) {
      const dashboardUrl = new URL("/", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// ---------------------------
// Konfigurasi matcher
// ---------------------------
