// middleware.js
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  if (
    (process.env.NODE_ENV === "production" &&
      req.nextUrl.pathname.startsWith("/api")) ||
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.rewrite(new URL("/404", req.url)); // Redirige a la página 404
  }
}
