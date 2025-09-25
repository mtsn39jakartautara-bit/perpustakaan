// middleware.ts
import type { NextRequest } from "next/server";
import { authMiddleware } from "./middleware/auth";

export async function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/profile",
    "/history",
    "/libraries",
  ],
};
