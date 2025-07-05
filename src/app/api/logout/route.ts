import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  // Overwrite the auth_token cookie to expire immediately
  (await
        cookieStore).set("auth_token", "", {
    path: "/",
    maxAge: 0, // Expire instantly
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect("/");
}
