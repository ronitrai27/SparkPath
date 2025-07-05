import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = ["/home"];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;

  const { pathname } = request.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    if (!authToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/home"],
};
