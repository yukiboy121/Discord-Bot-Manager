import { NextResponse } from "next/server";

export async function POST() {
  const baseUrl = process.env.WEB_APP_URL || "http://localhost:3000";
  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set("sentinel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function GET() {
  const baseUrl = process.env.WEB_APP_URL || "http://localhost:3000";
  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set("sentinel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
