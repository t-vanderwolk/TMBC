import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
